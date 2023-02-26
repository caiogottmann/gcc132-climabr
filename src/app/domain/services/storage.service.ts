import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { City } from '../entities/city.model';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private _storage: Storage | null = null;

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    const storage = await this.storage.create();
    this._storage = storage;
  }

  public async set(key: string, value: any) {
    await this._storage?.set(key, value);
  }

  public async get(key: string) {
    return (await this._storage?.get(key)) || [];
  }

  public async saveCity(city: City) {
    let cities: City[] = await this.get('cities');
    if (cities.length) {
      const existCity = cities.findIndex(
        (savedCity) => savedCity.id === city.id
      );

      if (existCity !== -1) cities.splice(existCity, 1);
    }
    cities.unshift(city);
    this._storage?.set('cities', [...cities]);
  }
}
