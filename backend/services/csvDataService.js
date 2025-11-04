const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');

class CSVDataService {
  constructor(filePath) {
    this.filePath = path.join(__dirname, filePath);
    this.data = [];
    this.loaded = false;
  }

  loadData() {
    return new Promise((resolve, reject) => {
      if (this.loaded) {
        resolve(this.data);
        return;
      }

      const results = [];
      fs.createReadStream(this.filePath)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => {
          this.data = results;
          this.loaded = true;
          console.log(`Loaded ${this.data.length} records from CSV`);
          resolve(this.data);
        })
        .on('error', (error) => {
          reject(error);
        });
    });
  }

  async getAll() {
    await this.loadData();
    return this.data;
  }

  async getById(id) {
    await this.loadData();
    return this.data.find(record => record.Freelancer_ID === id);
  }

  async getByField(field, value) {
    await this.loadData();
    return this.data.filter(record => record[field] === value);
  }

  async add(record) {
    await this.loadData();
    const newId = Math.max(...this.data.map(r => parseInt(r.Freelancer_ID || 0))) + 1;
    const newRecord = { Freelancer_ID: newId.toString(), ...record };
    this.data.push(newRecord);
    return newRecord;
  }

  async update(id, updates) {
    await this.loadData();
    const index = this.data.findIndex(record => record.Freelancer_ID === id);
    if (index === -1) return null;
    
    this.data[index] = { ...this.data[index], ...updates };
    return this.data[index];
  }

  async delete(id) {
    await this.loadData();
    const index = this.data.findIndex(record => record.Freelancer_ID === id);
    if (index === -1) return null;
    
    return this.data.splice(index, 1)[0];
  }
}

// Create service instances
const usersService = new CSVDataService('../data/freelancer_earnings_bd.csv');
const listingsService = new CSVDataService('../data/freelancer_earnings_bd.csv');

module.exports = { usersService, listingsService };