const sampleData = {
    busan: {
      yearly: [
        { year: 2022, temperature: 22.5, humidity: 60, pm25: 35, pm10: 50, nox: 20, nh3: 15, co2: 400, so2: 5, voc: 10 },
        { year: 2021, temperature: 21.8, humidity: 58, pm25: 30, pm10: 45, nox: 18, nh3: 12, co2: 390, so2: 6, voc: 12 },
      ],
      monthly: [
        { month: "January", temperature: 5.3, humidity: 70, pm25: 40, pm10: 55, nox: 22, nh3: 16, co2: 420, so2: 6, voc: 15 },
        { month: "February", temperature: 6.1, humidity: 68, pm25: 38, pm10: 50, nox: 20, nh3: 15, co2: 410, so2: 5, voc: 13 },
        { month: "March", temperature: 10.2, humidity: 65, pm25: 42, pm10: 58, nox: 25, nh3: 18, co2: 430, so2: 7, voc: 14 },
      ],
      weekly: [
        { week: "Week 1", temperature: 15.4, humidity: 62, pm25: 36, pm10: 48, nox: 19, nh3: 14, co2: 400, so2: 6, voc: 12 },
        { week: "Week 2", temperature: 16.3, humidity: 64, pm25: 40, pm10: 50, nox: 20, nh3: 15, co2: 410, so2: 5, voc: 13 },
        { week: "Week 3", temperature: 17.1, humidity: 66, pm25: 38, pm10: 52, nox: 22, nh3: 16, co2: 420, so2: 6, voc: 14 },
        { week: "Week 4", temperature: 16.8, humidity: 63, pm25: 35, pm10: 49, nox: 18, nh3: 14, co2: 400, so2: 5, voc: 12 },
      ],
      daily: [
        { day: "Monday", temperature: 20.5, humidity: 60, pm25: 30, pm10: 45, nox: 15, nh3: 12, co2: 380, so2: 4, voc: 11 },
        { day: "Tuesday", temperature: 21.0, humidity: 62, pm25: 32, pm10: 47, nox: 16, nh3: 13, co2: 390, so2: 5, voc: 12 },
        { day: "Wednesday", temperature: 21.5, humidity: 61, pm25: 35, pm10: 50, nox: 18, nh3: 14, co2: 400, so2: 5, voc: 12 },
        { day: "Thursday", temperature: 22.0, humidity: 63, pm25: 28, pm10: 43, nox: 14, nh3: 12, co2: 370, so2: 4, voc: 10 },
        { day: "Friday", temperature: 22.5, humidity: 64, pm25: 33, pm10: 48, nox: 17, nh3: 13, co2: 390, so2: 5, voc: 11 },
        { day: "Saturday", temperature: 23.0, humidity: 65, pm25: 40, pm10: 55, nox: 20, nh3: 15, co2: 420, so2: 6, voc: 13 },
        { day: "Sunday", temperature: 22.8, humidity: 66, pm25: 36, pm10: 50, nox: 19, nh3: 14, co2: 410, so2: 6, voc: 12 },
      ],
      hourly: [
        { hour: "00:00", temperature: 18.0, humidity: 70, pm25: 30, pm10: 45, nox: 15, nh3: 12, co2: 380, so2: 4, voc: 11 },
        { hour: "01:00", temperature: 17.8, humidity: 72, pm25: 32, pm10: 47, nox: 16, nh3: 13, co2: 390, so2: 5, voc: 12 },
        { hour: "02:00", temperature: 17.5, humidity: 71, pm25: 35, pm10: 50, nox: 18, nh3: 14, co2: 400, so2: 5, voc: 12 },
        { hour: "03:00", temperature: 17.0, humidity: 73, pm25: 28, pm10: 43, nox: 14, nh3: 12, co2: 370, so2: 4, voc: 10 },
        { hour: "04:00", temperature: 16.5, humidity: 75, pm25: 33, pm10: 48, nox: 17, nh3: 13, co2: 390, so2: 5, voc: 11 },
        { hour: "05:00", temperature: 16.0, humidity: 74, pm25: 40, pm10: 55, nox: 20, nh3: 15, co2: 420, so2: 6, voc: 13 },
        { hour: "06:00", temperature: 15.5, humidity: 76, pm25: 36, pm10: 50, nox: 19, nh3: 14, co2: 410, so2: 6, voc: 12 },
      ],
    },
    seoul: {
      yearly: [
        { year: 2022, temperature: 23.2, humidity: 58, pm25: 40, pm10: 60, nox: 25, nh3: 18, co2: 450, so2: 6, voc: 14 },
        { year: 2021, temperature: 22.7, humidity: 59, pm25: 38, pm10: 58, nox: 24, nh3: 17, co2: 440, so2: 5, voc: 13 },
      ],
      monthly: [
        { month: "January", temperature: 4.5, humidity: 65, pm25: 42, pm10: 62, nox: 27, nh3: 19, co2: 460, so2: 7, voc: 15 },
        { month: "February", temperature: 5.3, humidity: 67, pm25: 39, pm10: 59, nox: 24, nh3: 18, co2: 450, so2: 6, voc: 14 },
        { month: "March", temperature: 9.0, humidity: 64, pm25: 41, pm10: 61, nox: 26, nh3: 19, co2: 470, so2: 7, voc: 15 },
      ],
      weekly: [
        { week: "Week 1", temperature: 15.0, humidity: 61, pm25: 38, pm10: 57, nox: 22, nh3: 16, co2: 440, so2: 5, voc: 13 },
        { week: "Week 2", temperature: 15.8, humidity: 63, pm25: 40, pm10: 60, nox: 24, nh3: 17, co2: 450, so2: 6, voc: 14 },
        { week: "Week 3", temperature: 16.2, humidity: 65, pm25: 41, pm10: 62, nox: 25, nh3: 18, co2: 460, so2: 6, voc: 15 },
        { week: "Week 4", temperature: 16.5, humidity: 62, pm25: 39, pm10: 58, nox: 23, nh3: 16, co2: 440, so2: 5, voc: 13 },
      ],
      daily: [
        { day: "Monday", temperature: 21.8, humidity: 59, pm25: 37, pm10: 56, nox: 21, nh3: 15, co2: 430, so2: 4, voc: 12 },
        { day: "Tuesday", temperature: 22.3, humidity: 60, pm25: 38, pm10: 57, nox: 22, nh3: 16, co2: 440, so2: 5, voc: 13 },
        { day: "Wednesday", temperature: 22.8, humidity: 61, pm25: 40, pm10: 59, nox: 23, nh3: 17, co2: 450, so2: 6, voc: 14 },
        { day: "Thursday", temperature: 23.2, humidity: 62, pm25: 39, pm10: 58, nox: 23, nh3: 16, co2: 440, so2: 5, voc: 13 },
        { day: "Friday", temperature: 23.5, humidity: 63, pm25: 41, pm10: 60, nox: 25, nh3: 18, co2: 460, so2: 6, voc: 15 },
        { day: "Saturday", temperature: 23.8, humidity: 65, pm25: 42, pm10: 62, nox: 27, nh3: 19, co2: 470, so2: 7, voc: 15 },
        { day: "Sunday", temperature: 23.6, humidity: 64, pm25: 40, pm10: 59, nox: 24, nh3: 17, co2: 450, so2: 6, voc: 14 },
      ],
      hourly: [
        { hour: "00:00", temperature: 18.5, humidity: 68, pm25: 38, pm10: 57, nox: 22, nh3: 16, co2: 440, so2: 5, voc: 13 },
        { hour: "01:00", temperature: 18.2, humidity: 69, pm25: 39, pm10: 58, nox: 23, nh3: 16, co2: 440, so2: 5, voc: 13 },
        { hour: "02:00", temperature: 17.8, humidity: 70, pm25: 40, pm10: 59, nox: 24, nh3: 17, co2: 450, so2: 6, voc: 14 },
        { hour: "03:00", temperature: 17.5, humidity: 71, pm25: 42, pm10: 62, nox: 27, nh3: 19, co2: 470, so2: 7, voc: 15 },
        { hour: "04:00", temperature: 17.2, humidity: 72, pm25: 40, pm10: 60, nox: 24, nh3: 17, co2: 450, so2: 6, voc: 14 },
        { hour: "05:00", temperature: 16.9, humidity: 73, pm25: 38, pm10: 57, nox: 22, nh3: 16, co2: 440, so2: 5, voc: 13 },
        { hour: "06:00", temperature: 16.5, humidity: 74, pm25: 39, pm10: 58, nox: 23, nh3: 16, co2: 440, so2: 5, voc: 13 },
      ],
    },
  };
  