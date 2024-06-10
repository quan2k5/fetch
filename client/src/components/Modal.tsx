import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
type props={
    yes:()=>void,
   no:()=>void,
}
export default function Modal({yes,no}:props) {
  return (
    <div className='modal'>
        <div className='formModal'>
      <h3>Bạn có muốn xóa lo?</h3>
      <div>
      <Button onClick={yes}  variant="warning">OK</Button>{' '}
      <Button onClick={no} variant="danger">Cancel</Button>{' '}
      </div>
      </div>
    </div>
  )
}