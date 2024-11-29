import './App.css';
import { createTheme,ThemeProvider } from '@mui/material';
//react 
import { useEffect,useState } from 'react';

// material ui component
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import CloudIcon from '@mui/icons-material/Cloud';
import Button from '@mui/material/Button';

//external librairies
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import "moment/min/locales"
moment.locale("ar");



let cancelAxios=null

function App() {
  const { t, i18n } = useTranslation();
  const [dateAndTime,setDateAndTime]=useState("")
  const [temp,setTemp]=useState({
    number:null,
    description:"",
    min:null,
    max:null,
    icon:null
  })
  const [locale,setlocale]=useState("ar")
  const direction=locale=="ar"?"rtl":"ltr"

  function handleChangeLanguage(){
    if(locale=="en"){
      setlocale("ar")
      i18n.changeLanguage("ar")
      moment.locale("ar");
    }else {
      setlocale("en")
      i18n.changeLanguage("en")
      moment.locale("en");
    }
    setDateAndTime(moment().format('MMMM Do YYYY, h:mm:ss a'))
  }
  
  useEffect(()=>{
    i18n.changeLanguage(locale)

  },[])
  useEffect(()=>{
    setDateAndTime(moment().format('MMMM Do YYYY, h:mm:ss a'))
    axios.get('https://api.openweathermap.org/data/2.5/weather?lat=33.3&lon=-7.5&appid=2fcbebb946b6e1c965e2f0bbda9b7442',{
      cancelToken:new axios.CancelToken((c)=>{
         cancelAxios=c
      })
    })
      .then(function (response) {
        console.log(response.data)
      
        const responseTemp=Math.round(response.data.main.temp-275.15)
        const min=Math.round(response.data.main.temp_min-275.15)
        const max=Math.round(response.data.main.temp_max-275.15)
        const description=response.data.weather[0].description
        const responseIcon=response.data.weather[0].icon
       setTemp({number:responseTemp,
                description:description,
                min:min,
                max:max,
                icon:`https://openweathermap.org/img/wn/${responseIcon}@2x.png`
       })
       
        
      })
      .catch(function (error) {
        // en cas d’échec de la requête
        console.log(error);
      })
      return ()=>{
        cancelAxios()
      }

  },[])

  const theme=createTheme({
    typography:{
      fontFamily:["IBM"]
    }
  })
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <Container maxWidth="sm" >
          <div style={{display:"flex",flexDirection:"column",justifyContent:"center",
            alignItems:"start",height:"100vh"}}>
            {/* card */}
            <div dir={direction} style={{backgroundColor:"rgb(28 52 91 / 36%",
              color:"white",padding:"10px",borderRadius:"15px",
              boxShadow:"0px 11px 1px rgb(0,0,0,0.05)",width:"100%"}}>
                {/* content */}
                  <div >
                    {/* city & time */}
                      <div dir={direction} style={{display:"flex",alignItems:"end",justifyContent:"start"}}>
                          <Typography variant="h1" style={{marginRight:"20px",fontWeight:"500"}} >
                            {t("berrchid")} 
                          </Typography>
                          <Typography variant="h5" style={{marginRight:"20px"}}>
                          {dateAndTime}
                          </Typography>
                      </div>
                    {/* ==city & time== */}

                    <hr/>
                       {/* dgrees + could icons */}
                          <div  style={{display:"flex",justifyContent:"space-around"} }>
                            {/* degree & description */}
                              <div>
                                {/* temprature */}
                                  <div style={{display:"flex",justifyContent:"center",alignItems:"center"}}>
                                    <Typography variant="h1"  style={{textAlign:"right"}} >
                                      {temp.number} 
                                    </Typography>
                                    <img src={temp.icon}/>
                                  </div>                         
                                {/* ==temprature== */}
                                    <Typography variant="h6" >
                                      {t(temp.description)}
                                    </Typography>
                                    {/* min & max */}
                                    <div style={{display:"flex",justifyContent:"space-between",
                                      alignItems:"center"
                                    }}>
                                      <h5>{t("min")}:{temp.min}</h5>
                                      <h5 style={{margin:"0px 5px"}}>|</h5>
                                      <h5>{t("max")}:{temp.max}</h5>
                                    </div>

                                    {/*== min & max== */}
                                
                              </div>
                            {/* ==degree & description== */}
                            <CloudIcon style={{fontSize:"200px",color:"white"}}/>
                          </div>
                       {/* ===dgrees + could icons=== */}

                      
                  </div>
                {/* ===content=== */}

            </div>
            {/* ===card=== */}

            {/* tranlation container */}
            <div style={{marginTop:"20px"}}>
              <Button style={{color:"white"}} variant="text" onClick={handleChangeLanguage}>{locale=="en"?"Arabic":" انجليزي"}</Button>
            </div>
            {/*== tranlation container ==*/}

          </div>
        </Container>
      </ThemeProvider>
    </div>
  );
}

export default App;
