import React, { Component} from 'react';
import ChatBot from 'react-simple-chatbot';
import axios from 'axios';
import "./Chat.css"
class WeatherStep extends Component {
  constructor(props) {
    super(props);
  
    this.state = {
      name: '',
      in_state: '',
      city: '', 
    };
  }
  

  componentWillMount() {
    const { steps } = this.props;
    const { name, in_state } = steps;

    let city = '';
    switch (in_state.value) {
      case 'Andhra Pradesh':
        city = steps['5ap'].value;
        break;
      case 'Uttar Pradesh':
        city = steps['5up'].value;
        break;
      case 'Madhya Pradesh':
        city = steps['5mp'].value;
        break;
      default:
        break;
    }

    this.setState({ name, in_state, city });
  }

  componentDidMount() {
    const { city } = this.state;
    this.fetchWeatherData(city);
  }

  fetchWeatherData = async (city) => {
    try {
      const response = await axios.get(`http://localhost:5000/weather?city=${city}`);
      const data = response.data;
      this.setState({ weatherData: data });
    } catch (error) {
      console.error('Error fetching weather data:', error);
      this.setState({ fetchError: true });
    }
  };

  render() {
    const { weatherData} = this.state;
    const { city } = this.state;

    if (weatherData) {
      const forecast = weatherData.forecast.slice(0, 3).map((day) => (
        <div key={day.date}>
          <h3>{day.date}</h3>
          <p>Temperature: {day.temperature}°C</p>
          <p>Description: {day.description}</p>
          <p>Chance of Rain: {day.chance_of_rain}%</p>
          <p>Sunrise: {day.sunrise}</p>
          <p>Sunset: {day.sunset}</p>
          <hr />
        </div>
      ));

      return (
        <div>
          <h2>3-Day Weather Forecast for {city}</h2>
          {forecast}
        </div>
      );
    }
    return <div>Loading...</div>

    

  }
}



class Aichat extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ques: '',
      response: '',
    };
  }

  componentDidMount() {
    const { steps } = this.props;
    let ques = '';
    ques = steps['Others'].value;
    this.setState({ ques }, () => {
      this.fetchResponse(ques);
    });
  }

  fetchResponse = async (ques) => {
    try {
      const response = await axios.post('http://localhost:5000/ai_bot', {
        message: ques,
      });
      this.setState({ response: response.data.response });
    } catch (error) {
      console.error(error);
    }
  };

  render() {
    const { response } = this.state;

    return (
      <div>
        {response ? <p>{response}</p> : <p>Loading...</p>}
      </div>
    );
  }
}


class SimpleForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isChatbotOpen: false, // Track the state of chatbot visibility
    };
  }

  handleChatbotToggle = () => {
    this.setState((prevState) => ({
      isChatbotOpen: !prevState.isChatbotOpen,
    }));
  };

  handleEnd = () => {
    this.setState({ isChatbotOpen: false });
  };

  render() {
    const { isChatbotOpen } = this.state;
    return (
      <div className="chatbot-container">
        {isChatbotOpen ? (
          <div>
            <div className="chatbot-close" onClick={this.handleChatbotToggle}>
              X
            </div>
            <ChatBot
              steps={[
                {
                  id: '0',
                  message: 'Hello! Wellcome to AgriBot',
                  trigger: '1',
                },
                {
                  id: '1',
                  message: 'Please enter your name?',
                  trigger: 'name',
                },
                {
                  id: 'name',
                  user: true,
                  trigger: '3',
                },
                {
                  id: '3',
                  message: 'Hi {previousValue}! Please select your State?',
                  trigger: 'in_state',
                },
                {
                  id: 'in_state',
                  options: [
                    { value: 'Andhra Pradesh', label: 'Andhra Pradesh', trigger: '5ap1' },
                    { value: 'Uttar Pradesh', label: 'Uttar Pradesh', trigger: '5up1' },
                    { value: 'Madhya Pradesh', label: 'Madhya Pradesh', trigger: '5mp1' },
                  ],
                },
                {
                  id: '5ap1',
                  message: 'Great! Please select your City',
                  trigger:'5ap',
                },
                {
                  id: '5ap',
                  options: [
                    { value: 'Visakhapatnam', label: 'Visakhapatnam', trigger: 'issues' },
                    { value: 'East Godavari', label: 'East Godavari', trigger: 'issues' },
                    { value: 'Guntur', label: 'Guntur', trigger: 'issues' },
                  ],
                },
                {
                  id: '5up1',
                  message: 'Great! Please select your City',
                  trigger:'5up',
                },
                {
                  id: '5up',
                  options: [
                    { value: 'Meerut', label: 'Meerut', trigger: 'issues' },
                    { value: 'Agra', label: 'Agra', trigger: 'issues' },
                    { value: 'Kanpur', label: 'Kanpur', trigger: 'issues' },
                  ],
                },
                {
                  id: '5mp1',
                  message: 'Great! Please select your City',
                  trigger:'5mp',
                },
                {
                  id: '5mp',
                  options: [
                    { value: 'Balaghat', label: 'Balaghat', trigger: 'issues' },
                    { value: 'Khandwa', label: 'Khandwa', trigger: 'issues' },
                    { value: 'Anuppur', label: 'Anuppur', trigger: 'issues' },
                  ],
                },
                {
                  id: 'issues',
                  message: 'Please select your issue',
                  trigger: 'issueOptions',
                },
                {
                  id: 'issueOptions',
                  options: [
                    { value: 'Weather', label: 'Weather', trigger: 'Weather' },
                    { value: 'Others', label: 'Others', trigger: 'Others' },
                    { value: 'end', label: 'end', trigger: 'end-message' },
                  ],
                },
                {
                  id: 'Weather',
                  message: 'Please wait while we fetch the weather details...',
                  trigger: 'ShowWeather',
                },
                {
                  id: 'ShowWeather',
                  component: <WeatherStep/>,
                  waitAction: true,
                  asMessage: true,
                  trigger: 'issues',
                },
                {
                  id: 'Others',
                  user:true,
                  trigger: "show_chat",
                },
                {
                  id: "show_chat",
                  component: <Aichat/>,
                  waitAction: true,
                  asMessage: true,
                  trigger: 'issues',
                },
                {
                  id: 'end-message',
                  message: 'Thanks You!',
                  end: true,
                },
              ]}
              handleEnd={this.handleEnd}
              ref={(ref) => (this.chatbot = ref)}
            />
            
          </div>
        ) : (
          <div className="chatbot-button" onClick={this.handleChatbotToggle}>
            Chat
          </div>
        )}
      </div>
    );
  }
}

export default SimpleForm;

       
