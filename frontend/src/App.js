import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  TextField,
  Switch,
  FormControlLabel,
  Divider,
  Alert,
} from '@mui/material';
import axios from 'axios';

const MAIN_API_URL = 'http://localhost:5000';
const SECONDARY_API_URL = 'http://localhost:5001';

function App() {
  const [mainApiConfig, setMainApiConfig] = useState({
    allow_origins: ['http://localhost:3000'],
    allow_methods: ['GET', 'POST', 'OPTIONS'],
    allow_headers: ['Content-Type'],
    allow_credentials: false,
  });

  const [secondaryApiConfig, setSecondaryApiConfig] = useState({
    allow_origins: [],
    allow_methods: ['GET', 'POST', 'OPTIONS'],
    allow_headers: ['Content-Type'],
    allow_credentials: false,
  });

  const [responses, setResponses] = useState({
    main: '',
    secondary: '',
  });

  const [error, setError] = useState('');

  const updateCorsConfig = async (isMainApi, config) => {
    try {
      const baseUrl = isMainApi ? MAIN_API_URL : SECONDARY_API_URL;
      await axios.post(`${baseUrl}/api/config/cors`, config);
      if (isMainApi) {
        setMainApiConfig(config);
      } else {
        setSecondaryApiConfig(config);
      }
      setError('');
    } catch (err) {
      setError(`Failed to update CORS config: ${err.message}`);
    }
  };

  const testApi = async (isMainApi) => {
    try {
      const baseUrl = isMainApi ? MAIN_API_URL : SECONDARY_API_URL;
      const response = await axios.get(`${baseUrl}/api/data`);
      setResponses(prev => ({
        ...prev,
        [isMainApi ? 'main' : 'secondary']: JSON.stringify(response.data, null, 2)
      }));
      setError('');
    } catch (err) {
      setError(`API test failed: ${err.message}`);
    }
  };

  const ApiConfigSection = ({ isMainApi, config, onConfigChange }) => (
    <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6" gutterBottom>
        {isMainApi ? 'Main API' : 'Secondary API'} CORS Configuration
      </Typography>
      <Box sx={{ mb: 2 }}>
        <TextField
          fullWidth
          label="Allowed Origins (comma-separated)"
          value={config.allow_origins.join(',')}
          onChange={(e) => {
            const origins = e.target.value.split(',').map(o => o.trim()).filter(Boolean);
            const newConfig = { ...config, allow_origins: origins };
            onConfigChange(newConfig);
          }}
          margin="normal"
        />
        <FormControlLabel
          control={
            <Switch
              checked={config.allow_credentials}
              onChange={(e) => {
                const newConfig = { ...config, allow_credentials: e.target.checked };
                onConfigChange(newConfig);
              }}
            />
          }
          label="Allow Credentials"
        />
      </Box>
      <Button
        variant="contained"
        onClick={() => updateCorsConfig(isMainApi, config)}
        sx={{ mr: 1 }}
      >
        Update CORS Config
      </Button>
      <Button
        variant="outlined"
        onClick={() => testApi(isMainApi)}
      >
        Test API
      </Button>
      {responses[isMainApi ? 'main' : 'secondary'] && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2">Response:</Typography>
          <pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '4px' }}>
            {responses[isMainApi ? 'main' : 'secondary']}
          </pre>
        </Box>
      )}
    </Paper>
  );

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        CORS Demo Application
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        This demo shows how CORS policies affect API requests between different origins.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <ApiConfigSection
        isMainApi={true}
        config={mainApiConfig}
        onConfigChange={setMainApiConfig}
      />

      <ApiConfigSection
        isMainApi={false}
        config={secondaryApiConfig}
        onConfigChange={setSecondaryApiConfig}
      />
    </Container>
  );
}

export default App; 