/**
 * @details: Created by Nyxz
 * @author: Andhika
 * @channel: https://whatsapp.com/channel/0029VaAMjXT4yltWm1NBJV3J
 * @note: Don't delete this WM!
 */

/*
// IF USED ESM
import axios from 'axios';
import mqtt from 'mqtt';
*/

// IF USED CJS
const axios = require("axios")
const mqtt = require('mqtt')


/**
 * Utility class for generating random identifiers and strings
 */
class RandomGenerator {
  /**
   * Generates a unique identifier (UUID) following the version 4 UUID standard.
   * 
   * @returns {string} A randomly generated UUID string
   */
  static generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  /**
   * Generates a random alphanumeric string of specified length.
   * 
   * @param {number} length - The desired length of the random string
   * @returns {string} A randomly generated string
   */
  static generateRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    
    return result;
  }
}

/**
 * Felo AI MQTT Client for handling AI interactions
 */
class FeloAI {
  /**
   * Create a new Felo AI Client
   * 
   * @param {Object} config - Configuration options for the client
   * @param {string} config.apiBaseUrl - Base URL for Felo AI API
   * @param {string} [config.agentLang='id'] - Language for the agent
   * @param {string} [config.mode='concise'] - Response mode
   * @param {number} [config.timeout=60000] - Timeout for response in milliseconds
   */
  constructor(config = {}) {
    this.config = {
      apiBaseUrl: 'https://api.felo.ai',
      agentLang: config.agentLang || 'id',
      mode: config.mode || 'concise',
      timeout: config.timeout || 60000 // Default 60 seconds timeout
    };

    this.mqttClient = null;
    this.isConnected = false;
    this.connectionInfo = null;
  }

  /**
   * Generates headers for API requests
   * 
   * @returns {Object} Headers for API requests
   * @private
   */
  _generateHeaders() {
    const client_id = RandomGenerator.generateUUID();
    const visitor_id = RandomGenerator.generateUUID();

    return {
      "accept": "*/*",
      "accept-language": "id,id-ID;q=0.9,en-US;q=0.8,en;q=0.7",
      "cache-control": "no-cache",
      "pragma": "no-cache",
      "sec-ch-ua": "\"Not_A Brand\";v=\"99\", \"Google Chrome\";v=\"109\", \"Chromium\";v=\"109\"",
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": "\"Windows\"",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-site",
      "cookie": `visitor_id=${visitor_id}`,
      "Referer": "https://felo.ai/",
      "Referrer-Policy": "strict-origin-when-cross-origin"
    };
  }

  /**
   * Establishes MQTT connection
   * 
   * @param {Object} connectionParams - MQTT connection parameters
   * @returns {Promise<void>}
   * @private
   */
  _connect = async function(connectionParams) {
    return new Promise((resolve, reject) => {
      try {
        console.log("MQTT Connection Started");

        // Validate required connection parameters
        if (!connectionParams.ws_url || !connectionParams.client_id || 
            !connectionParams.username || !connectionParams.password) {
          throw new Error('Missing required connection parameters.');
        }

        // Create MQTT connection
        this.mqttClient = mqtt.connect(connectionParams.ws_url, {
          keepalive: 0,
          connectTimeout: 30000,
          clean: false,
          clientId: connectionParams.client_id,
          username: connectionParams.username,
          password: connectionParams.password,
          protocolVersion: 5
        });

        this.connectionInfo = connectionParams;

        // Connection event handlers
        this.mqttClient.on("connect", () => {
          console.log("MQTT Connected");
          this.isConnected = true;
          resolve();
        });

        this.mqttClient.on("disconnect", () => {
          console.log("MQTT Disconnected");
          this.isConnected = false;
        });

        this.mqttClient.on("offline", () => {
          console.log("MQTT Offline");
          this.isConnected = false;
        });

        this.mqttClient.on("error", (err) => {
          console.error("MQTT Error", err);
          reject(err);
        });

        // Subscribe to the specified topic
        this.mqttClient.subscribe(connectionParams.sub_topic);
      } catch (error) {
        console.error("Error in MQTT setup:", error.message);
        if (this.mqttClient) {
          this.mqttClient.end();
        }
        reject(error);
      }
    });
  }

  /**
   * Publishes a message to the specified topic
   * 
   * @param {string} message - Message to be published
   * @throws {Error} If MQTT client is not connected
   */
  publish(message) {
    if (this.mqttClient && this.connectionInfo) {
      this.mqttClient.publish(this.connectionInfo.pub_topic, message);
    } else {
      throw new Error("MQTT client is not connected");
    }
  }

  /**
   * Asks a question to Felo AI
   * 
   * @param {string} query - The query to send to Felo AI
   * @returns {Promise<Object>} An object containing the AI's response details
   */
  ask = async function(query) {
    return new Promise(async (resolve, reject) => {
      let timeoutId;

      try {
        // Prepare connection
        const headers = this._generateHeaders();
        
        // Initiate connection
        const url_init = `${this.config.apiBaseUrl}/search/user/connection?client_id=${headers['cookie'].split('=')[1]}`;
        const init = await axios.get(url_init, { headers }).then(p => p.data);

        // Connect to MQTT
        await this._connect(init);

        // Set up timeout
        timeoutId = setTimeout(() => {
          this.disconnect();
          reject(new Error('Response timed out'));
        }, this.config.timeout);

        // Publish query
        this.publish(JSON.stringify({
          "event_name": "ask_question",
          "data": {
            "process_id": RandomGenerator.generateRandomString(21),
            "query": query,
            "search_uuid": RandomGenerator.generateRandomString(21),
            "lang": "",
            "agent_lang": this.config.agentLang,
            "search_options": {
              "langcode": this.config.agentLang
            },
            "search_video": true,
            "query_from": "default",
            "category": "google",
            // "model": "",
            "auto_routing": true,
            "mode": this.config.mode,
            "device_id": "a0d7b8929d310544f4fcfd1953c7f154",
            "documents": [],
            "document_action": ""
          }
        }));

        // Response object to collect AI response details
        let respon = {};

        // Handle incoming messages
        const messageHandler = async (topic, message) => {
          const json_res = JSON.parse(message.toString());
          
          if (json_res.status === "process") {
            const lanjut = json_res.data;
            
            // Collect different parts of the response
            switch (lanjut.type) {
              case "qr_info":
                respon.title = lanjut.data.rewriters;
                break;
              case "final_contexts":
                respon.source = lanjut.data.sources;
                break;
              case "answer":
                respon.text = lanjut.data.text;
                break;
              case "related_questions":
                respon.relate = lanjut.data.questions.map(x => x.question);
                break;
            }
          } else if (json_res.status === "complete") {
            // Clear timeout
            clearTimeout(timeoutId);

            // Remove message listener
            this.mqttClient.removeListener('message', messageHandler);

            // Auto disconnect and resolve
            await this.disconnect();
            resolve(respon);
          }
        };

        // Add message listener
        this.mqttClient.on('message', messageHandler);

      } catch (error) {
        // Clear timeout if an error occurs
        if (timeoutId) clearTimeout(timeoutId);

        console.error("Error in ask method:", error.message);
        await this.disconnect();
        reject(error);
      }
    });
  }

  /**
   * Closes the MQTT connection
   * 
   * @returns {Promise<void>}
   */
  disconnect = async function() {
    return new Promise((resolve, reject) => {
      if (this.mqttClient) {
        this.mqttClient.end(true, (err) => {
          if (err) {
            console.error('Error during disconnection:', err);
            reject(err);
          } else {
            this.isConnected = false;
            this.mqttClient = null;
            this.connectionInfo = null;
            console.log('MQTT Client Disconnected');
            resolve();
          }
        });
      } else {
        resolve();
      }
    });
  }
}

// MAKE IMPORT MODULE //

// IF USED ESM
// export default FeloAI;

// IF USED CJS
module.exports = new FeloAI() ;
