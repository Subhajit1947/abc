import React,{useState,useEffect} from 'react'
import axios from 'axios'
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { TextField } from '@mui/material';
import { Link,useNavigate,redirect } from 'react-router-dom';
import Edit from './Edit'
import { useKeycloak } from "@react-keycloak/web";

function Home() {
  const [data,setdata]=useState([])
  // const [id,setid]=useState()
  const navigate=useNavigate()
  const { keycloak, initialized } = useKeycloak();
  const token = keycloak.token;
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  
  // const querydata=`{
  //   allTodo{
  //     id,
  //     title,
  //     desc,
  //     createDate
  //   }
  // }`
  
  
  const querydata=`{
    userTodos(id:"${keycloak.tokenParsed.preferred_username}"){
      id,
      title,
      desc,
      createDate
    }
  }`
  useEffect(()=>{    
    axios.post('http://127.0.0.1:5000/graphql',{query:querydata},{headers}).then((res)=>{
      console.log(res.data)
      
      setdata([...res.data.data.userTodos])
    })
  },[])
  
  const handledelete=async(id)=>{
    let res=await axios.post('http://127.0.0.1:5000/deltodo',{id:id},{headers})
    setdata(() => data.filter((todo) => todo.id !== id))
    console.log('successfully delete')
    redirect('/')
    
      
    
  }

  
  
 
  return (
    <>
    {data.length!=0?
    <div style={{width:'100vw',display:"flex",flexDirection:"row",alignItems:'flex-start',justifyContent:'center',flexWrap:'wrap'}}>
      {data.map((item)=>
        
        <div style={{height:'15rem',width:'20rem',margin:'5px'}}>
          <Card  style={{display:"flex",flexDirection:"column",alignItems:'center'}}>
          
          <CardContent >
              <div style={{display:"flex",flexDirection:"column",alignItems:'center'}}>
                <Typography variant="h4" component="div">
                  {item.title}
                </Typography>
                <Typography  component="div">
                  {item.desc}
                </Typography>
                <Typography  component="div">
                  {item.createDate}
                </Typography>
              </div>
              
          </CardContent>
          <CardActions>
              <Button style={{marginRight:'5px'}} size="small" onClick={(e)=>handledelete(item.id)} variant="contained" color='error' >delete</Button>
              <Edit item={item} data={data} setdata={setdata}/>
          </CardActions>
          </Card>
      </div>
      )}
    </div>:
  
    <h1>no content</h1>}
  </>
  )
}

export default Home