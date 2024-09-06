import dotenv from 'dotenv';

dotenv.config();

interface Config {
  port: number;
  jenkins: {
    jenkinsUrl: string;
    jenkinsUserName: string;
    jenkinsPassword: string;
  };
}

const config: Config = {
  port: parseInt(process.env.PORT || '3000', 10),
  jenkins: {
    jenkinsUrl: process.env.JENKINS_URL || 'http://localhost:8080',
    jenkinsUserName: process.env.JENKINS_USERNAME || '',
    jenkinsPassword: process.env.JENKINS_PASSWORD || '',
  },
};

export default config;
