import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useState } from 'react';
import axios from 'axios';
import { useKeycloak } from "@react-keycloak/web";


export default function Edit({item,data,setdata}) {
  const [open, setOpen] = React.useState(false);
  const [title,settitle]=useState(item.title)
  const [desc,setdesc]=useState(item.desc)
  const { keycloak, initialized } = useKeycloak();
  const storedData = localStorage.getItem('flaskt');
  const parsedData = JSON.parse(storedData)
  const headers = {
      Authorization: `Bearer ${parsedData}`,
      'Content-Type': 'application/json',
  };



  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleupdate=async()=>{
    const a={
        'id':item.id,
        'title':title,
        'desc':desc
    }
    await axios.post('http://127.0.0.1:5000/update-todo',a,{headers})
    setdata(()=>data.map((i)=>i.id==item.id?{...i,title:title,desc:desc}:i))
    setOpen(false);
  }
  return (
    <div>
        <Button size="small" variant="contained" color='secondary' onClick={handleClickOpen} >edit</Button>
    
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Subscribe</DialogTitle>
        <DialogContent>
          <DialogContentText>
            edit 
          </DialogContentText>
          <div style={{display:"flex",flexDirection:"column",alignItems:'center'}}>
            <TextField value={title} onChange={(e)=>settitle(e.target.value)} style={{marginBottom:'10px'}} id="outlined-basic" label="Title" variant="outlined" />
            <TextField
                onChange={(e)=>setdesc(e.target.value)}
                value={desc}
                style={{marginBottom:'10px'}}
                id="outlined-multiline-static"
                label="Description"
                multiline
                rows={4}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleupdate}>save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
