import ReactWeather, {useOpenWeather} from 'react-open-weather';
// function weatherBalloon( cityID ) {
//   var key = '04b880df429434d7b1778907fa79b3ee';
//   fetch('https://api.openweathermap.org/data/2.5/weather?id=' + cityID+ '&appid=' + key)  
//   .then(function(resp) { return resp.json() }) // Convert data to json
//   .then(function(data) {
//     //console.log(JSON.stringify(data));
//     return data;
//   })
//   .catch(function() {
//     // catch any errors
//   });
// }
// window.onload = function() {
//   weatherBalloon( 6167865 );
// }
// console.log(weatherBalloon(6167865 ))
export function WeatherWidget(){
  const { data, isLoading, errorMessage } = useOpenWeather({
      key: '04b880df429434d7b1778907fa79b3ee',
      lat: '40.885632',
      lon: '-72.388509',
      lang: 'en',
      unit: 'imperial', // values are (metric, standard, imperial)
    });
  if(data != null){
    console.log(JSON.stringify(data))
    return (
      <div className = "wheather-wrapper">
        <ReactWeather
          isLoading={isLoading}
          errorMessage={errorMessage}
          data={data}
          lang="en"
          locationLabel="Restaurant's City"
          unitsLabels={{ temperature: 'F', windSpeed: 'Mph' }}
          showForecast
        />
        <div id = "current-forecast">
          <p>{data.current.description}</p>
        </div>    
      </div>  
    ); 
  }
};