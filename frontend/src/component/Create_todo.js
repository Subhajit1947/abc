import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { TextField } from '@mui/material';
import { useState,useEffect } from 'react';
import axios from 'axios';
import { Link,useNavigate } from 'react-router-dom';
import { useKeycloak } from "@react-keycloak/web";


export default function Create_todo() {
    const [title,settitle]=useState()
    const [desc,setdesc]=useState()
    const navigate=useNavigate()
    const { keycloak, initialized } = useKeycloak();
    const token = keycloak.token;
    const headers = {
        Authorization: `Bearer ${token}`,
    };
    const handlesubmit=async()=>{
        const senddata={
            "title":title,
            "desc":desc
        }
        await axios.post('http://127.0.0.1:5000/create-todo',senddata,{headers})
        navigate('/')
    }
  return (
    <div style={{display:"flex",flexDirection:"row",justifyContent:"center"}}>
        <Card  style={{display:"flex",flexDirection:"column",alignItems:'center'}}>
        <Typography gutterBottom variant="h4" component="div">
            create todo list
        </Typography>
        <CardContent >
            <div style={{display:"flex",flexDirection:"column",alignItems:'center'}}>
                <TextField onChange={(e)=>settitle(e.target.value)} style={{marginBottom:'10px'}} id="outlined-basic" label="Title" variant="outlined" />
                <TextField
                    onChange={(e)=>setdesc(e.target.value)}
                    style={{marginBottom:'10px'}}
                    id="outlined-multiline-static"
                    label="Description"
                    multiline
                    rows={4}
                />
            </div>
            
        </CardContent>
        <CardActions>
           <Button size="small" variant="contained" onClick={handlesubmit}>create</Button> 
            
        </CardActions>
        </Card>
    </div>
  );
}
