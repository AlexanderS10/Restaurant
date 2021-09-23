import ReactWeather, {useOpenWeather} from 'react-open-weather';
export function WheatherWidget(){
    const { data, isLoading, errorMessage } = useOpenWeather({
      key: '04b880df429434d7b1778907fa79b3ee',
      lat: '40.905937',
      lon: '-72.423036',
      lang: 'en',
      unit: 'imperial', // values are (metric, standard, imperial)
    });
    return (
      <div class = "wheather-wrapper">
          <ReactWeather
          isLoading={isLoading}
          errorMessage={errorMessage}
          data={data}
          lang="en"
          locationLabel="Southampton"
          unitsLabels={{ temperature: 'F', windSpeed: 'Mph' }}
          showForecast
        />
      </div>
      
    );
  };