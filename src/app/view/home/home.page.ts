import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/domain/services/storage.service';
import { City } from '../../domain/entities/city.model';
import { SearchCityService } from '../../domain/services/search-city.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  errorMessage = null;
  cities: City[] = [];
  cachedCities: City[] = [];
  showCachedCities = false;

  constructor(
    private readonly cityService: SearchCityService,
    private readonly router: Router,
    private readonly storageService: StorageService
  ) {}

  async ionViewDidEnter() {
    this.cities = this.cachedCities = await this.storageService.get('cities');
    this.showCachedCities = Boolean(this.cachedCities.length);
  }

  async onSearch(query: string) {
    try {
      this.errorMessage = null;
      const searchCities = await this.cityService.searchByName(query);

      this.showCachedCities = this.cachedCities.length && !searchCities.length;
      this.cities = searchCities.length ? searchCities : this.cachedCities;
    } catch (error) {
      this.errorMessage = error.message;
    }
  }

  async onSelect(city: City) {
    await this.router.navigateByUrl(`/weather/${city.id}`, {
      replaceUrl: true,
    });
    await this.storageService.saveCity(city);
  }
}
