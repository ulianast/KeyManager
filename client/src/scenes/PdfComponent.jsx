import React from 'react';
import axios from 'axios';
import auth from '../utils/auth';
// import PDFDocument from 'pdfkit';
// import blobStream from 'blob-stream';
//import { Page } from 'react-pdf';
import { Document, Page } from 'react-pdf/dist/entry.webpack';

class PdfComponent extends React.Component {
  state = {
    numPages: null,
    pageNumber: 1,
    fileUrl: ''
  }
  
  componentDidMount() {
    //console.log(serviceId);

    const token = auth.getToken();
    const authHeader = `JWT ${token}`;

    axios.get('/staffOnly/pdf/T993-W94P-3XJH-3UWR', {headers: {
      "timeout": 10000, 
      "Authorization": authHeader,
      "responseType": 'arraybuffer' //Force to receive data in a Blob Format
    }})
    .then(response =>{
      //Create a Blob from the PDF Stream
      const file = new Blob(
        [response.data], 
        {type: 'application/pdf'});


      console.log(file);

      // var pdf = "data:application/pdf;base64,JVBERi0xLjMKJe+/ve+/ve+/ve+/vQo1IDAgb2JqCjw8Ci9UeXBlIC9QYWdlCi9QYXJlbnQgMSAwIFIKL01lZGlhQm94IFswIDAgNjEyIDc5Ml0KL0NvbnRlbnRzIDMgMCBSCi9SZXNvdXJjZXMgNCAwIFIKPj4KZW5kb2JqCjQgMCBvYmoKPDwKL1Byb2NTZXQgWy9QREYgL1RleHQgL0ltYWdlQiAvSW1hZ2VDIC9JbWFnZUldCi9Gb250IDw8Ci9GMSA2IDAgUgo+Pgo+PgplbmRvYmoKNyAwIG9iago8PAovUHJvZHVjZXIgKFBERktpdCkKL0NyZWF0b3IgKFBERktpdCkKL0NyZWF0aW9uRGF0ZSAoRDoyMDE4MDQyODExNDAyMVopCj4+CmVuZG9iago2IDAgb2JqCjw8Ci9UeXBlIC9Gb250Ci9CYXNlRm9udCAvSGVsdmV0aWNhCi9TdWJ0eXBlIC9UeXBlMQovRW5jb2RpbmcgL1dpbkFuc2lFbmNvZGluZwo+PgplbmRvYmoKMiAwIG9iago8PAovVHlwZSAvQ2F0YWxvZwovUGFnZXMgMSAwIFIKPj4KZW5kb2JqCjEgMCBvYmoKPDwKL1R5cGUgL1BhZ2VzCi9Db3VudCAxCi9LaWRzIFs1IDAgUl0KPj4KZW5kb2JqCjMgMCBvYmoKPDwKL0xlbmd0aCAxMjgKL0ZpbHRlciAvRmxhdGVEZWNvZGUKPj4Kc3RyZWFtCnjvv71l77+977+9CkIxDEXvv718RX5ATe+/ve+/ve+/vRVKB0EHN++/ve+/vTjvv73vv73vv73vv73vv70v5qGbXEhuDu+/vShLZO+/vTHvv70aP1Z677+977+977+977+977+9QWXvv73vv73vv73vv71SeO+/vXQ4K1vvv71J77+977+9FxQ3FBNUTybvv70w77+977+9bkffrO+/ve+/ve+/vRnvv70tHO+/ve+/ve+/vXdDXe+/ve+/ve+/ve+/ve+/ve+/vW3vv70t77+977+977+977+9Qu+/vUFX77+9AO+/vV4j77+9CmVuZHN0cmVhbQplbmRvYmoKeHJlZgowIDgKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwNDQ2IDAwMDAwIG4gCjAwMDAwMDAzOTcgMDAwMDAgbiAKMDAwMDAwMDUwMyAwMDAwMCBuIAowMDAwMDAwMTE5IDAwMDAwIG4gCjAwMDAwMDAwMTUgMDAwMDAgbiAKMDAwMDAwMDMwMCAwMDAwMCBuIAowMDAwMDAwMjA4IDAwMDAwIG4gCnRyYWlsZXIKPDwKL1NpemUgOAovUm9vdCAyIDAgUgovSW5mbyA3IDAgUgo+PgpzdGFydHhyZWYKNzAzCiUlRU9GCg=="
      //     ;
      // window.open(pdf, '_blank');

      // const fileURL = URL.createObjectURL(file);
      // window.open(fileURL, '_blank');
      const fileUrl = URL.createObjectURL(file);

      window.open(fileUrl, '_blank');
      // console.log(fileUrl);

      // this.setState({
      //   fileUrl: fileUrl
      //   //fileUrl: './test.pdf'
      // });
    })
    .catch(error => {
      console.log(error);
      this.setState({
        error: (error.response && error.response.data && error.response.data.error) ? 
          error.response.data.error : 
          'Неизвестная ошибка. Пожалуйста обратитесь в поддержку.'
      });
    });
  // iframe.src = url
  }


 
  onDocumentLoad = ({ numPages }) => {
    this.setState({ numPages });
  }

  render() {
    const { pageNumber, numPages, fileUrl } = this.state;
 
    return (
      <div>
        {fileUrl &&
          <Document
            file={this.state.fileUrl}
            onLoadSuccess={this.onDocumentLoad}
          >
            <Page pageNumber={pageNumber} />
          </Document>
        }
          <p>Page {pageNumber} of {numPages}</p>
           <p>File {fileUrl} </p>

      </div>
    );
  }

  // render() {
  //   return(<iframe id="pdf-iframe"  width="540" height="450"></iframe>)
  // }
}

export default PdfComponent;