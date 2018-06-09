import React from 'react';
import AddXlsx from '../../components/AddXlsx/AddXlsx';
import XLSX from 'xlsx';
import _ from 'lodash';
import axios from 'axios';
import auth from '../../utils/auth';
import ErrorStatus from '../../components/ErrorStatus/ErrorStatus';
import TabHeader from '../../components/TabHeader/TabHeader';
import Authorization from '../../components/Authorization';
import Notifications from '../../components/NotificationMessage/Notification';
import SmartTable from '../../components/SmartTable/SmartTable';
import Chip from 'material-ui/Chip';

const ACTIVE_LICENCES = 'ACTIVE',
      ALL_LICENCES = 'ALL';

class AddLicenceCodes extends React.Component {

  constructor(props) {
    super(props);

    // set the initial component state
    this.state = {
      error: '',
      lots: [],
      filteredLots: [],
      activeFilter: ACTIVE_LICENCES
    };

    this.onFileSelected = this.onFileSelected.bind(this);
    this.fetchLots = this.fetchLots.bind(this);
  }

  onFileSelected(event) {
    event.preventDefault();

    this.setState({
      error: '',
      status: {}
    });

    if (event.target.files) {
      const file = event.target.files[0];
      event.target.value = null;
      const reader = new FileReader();
      
      reader.onload = function(e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, {type: 'array'});
        const sheetNameList = workbook.SheetNames;
        const jsonSheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetNameList[0]]);
        const isSheetFormatValid = checkXlsxHeaders(jsonSheet[0]);

        if (isSheetFormatValid) {
          const jsonData = normalizeData(jsonSheet);

          const token = auth.getToken();
          const authHeader = `JWT ${token}`;
          
          axios.post('/staffOnly/uploadCodes', {data: jsonData}, {headers: {
            "timeout": 10000, 
            "Authorization": authHeader 
          }})
          .then(response => {   
            console.log(response);
            if (response.status === 200) {
              this.setState({
                status : {
                  message: "Коды активации были успешно импортированны",
                  timestamp: new Date().getTime()
                }
              });

              this.fetchLots();
            }
            //all responses with 400 staus codes automatically go to catch section according to axios implementation       
          })
          .catch(error => {
            console.log(error);
            this.setState({
              error: (error.response && error.response.data && error.response.data.error) ? 
                error.response.data.error : 
                'Неизвестная ошибка. Пожалуйста обратитесь в поддержку.'
            });
          });
        }
        else {
          const errorMessage = 'Неверный формат документа. Отсутствует одна или несколько обязательных колонок: ' +
            '"Наименование", "Цена без НДС", "Код"';

          this.setState({
            error: errorMessage
          });
        }
      }.bind(this);

      reader.readAsArrayBuffer(file);
    }
  }

  fetchLots() {
    const token = auth.getToken();
    const authHeader = `JWT ${token}`;

    axios.get('/staffOnly/lots', { headers: {
      "timeout": 10000, 
      "Authorization": authHeader 
    }})
    .then(response =>{
      if (response && response.data && response.data.lots) {
        this.setState({
          lots: response.data.lots,
          filteredLots: this.filterLots(this.state.activeFilter, response.data.lots)
        });
      }
    })
    .catch(error => {
      this.setState({
        error: (error.response && error.response.data && error.response.data.error) ? 
          error.response.data.error : 
          'Неизвестная ошибка. Пожалуйста обратитесь в поддержку.'
      });
    });
  }

  handleChipClick = (type) => {
    this.setState({
      activeFilter: type,
      filteredLots: this.filterLots(type, this.state.lots)
    });
  }

  filterLots = (type, lots) => {
    let filteredLots = [];

    switch(type) {
      case ALL_LICENCES:
        filteredLots = _.clone(lots);
        break;
      case ACTIVE_LICENCES:
        filteredLots = _.filter(lots, (item) => {
          return item.availableLicences > 0
        });
        break;
    }

    return filteredLots;
  }

  componentDidMount() {
    this.fetchLots();
  }

  render() {
    const { filteredLots, status, error, activeFilter } = this.state;
    const tableHeaders = [
      { id: 'licence', numeric: false, label: 'Лицензия' },
      { id: 'createdAt', numeric: true, isDateType: true, label: 'Дата загрузки' },
      { id: 'price', numeric: true, label: 'Цена' }, 
      { id: 'number', numeric: true, label: 'Номер партии' }, 
      { id: 'availableLicences', numeric: true, label: 'Доступные ключи' }, 
      { id: 'totalLicences', numeric: true, label: 'Всего ключей' }, 
    ];

    return (
      <div>
        <TabHeader tabText='Лицензионные коды'/>
        <ErrorStatus error={error} />
        <div className="control-fields">
          <span className="chip-container">
            <Chip
              tabIndex={-1}
              label="Все лицензии"
              onClick={() => this.handleChipClick(ALL_LICENCES)}
              className={activeFilter === ALL_LICENCES ? 'selected date-select-chip' : 'date-select-chip'}
            />
            <Chip
              tabIndex={-1}
              label="Только с доступными ключами"
              onClick={() => this.handleChipClick(ACTIVE_LICENCES)}
              className={activeFilter === ACTIVE_LICENCES ? 'selected date-select-chip' : 'date-select-chip'}
            />
          </span>
          <AddXlsx
            onFileSelected={this.onFileSelected}
          />
        </div>
        <SmartTable
          columnHeaders={tableHeaders}
          data={filteredLots}
          disableToolbar={true}
        />
        <Notifications status={status}/>
      </div>
      );
  }
}


function checkXlsxHeaders(firstRow) {
  const isValid = firstRow && firstRow["Наименование"] && firstRow["Цена без НДС"] && firstRow["Код"];
  return isValid;
}

function normalizeData(rawData) {
  //1 step - removing Cyrillic keys and skip repeated data
  const jsonDataMap = new Map();
  _.forEach(rawData, (element, i) => {
    const elementName = element["Наименование"];  
    const elementPrice = element["Цена без НДС"];  

    if ( ! jsonDataMap.get(elementName)) {
      jsonDataMap.set(elementName, new Map());
    }

    const serviceNameMapItem = jsonDataMap.get(elementName);

    if ( ! serviceNameMapItem.get(elementPrice)) {
      serviceNameMapItem.set(elementPrice, []);
    }

    const servicePriceMapItem = serviceNameMapItem.get(elementPrice);
    servicePriceMapItem.push(element["Код"]);
  });

  //2 step - convert Map to Array
  const resultJson = [];
  
  for (let [name, price2CodesMap] of jsonDataMap) {
    for (let [price, codesArr] of price2CodesMap) {
      const jsonItem = {
        name : name,
        price : price,
        codes: codesArr
      };
      resultJson.push(jsonItem);
    }    
  }

  return resultJson; 
}

//export default AddLicenceCodes;
export default Authorization(AddLicenceCodes, ['vendor']);