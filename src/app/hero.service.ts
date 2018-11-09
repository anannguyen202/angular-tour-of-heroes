import { Injectable } from '@angular/core';
import { HEROES } from './mock-heroes';
import { Hero } from './hero';
import { MessageService } from './message.service';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class HeroService {

  private heroesUrl = 'api/heroes';

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) { }

  searchHeroes(term: string): Observable<Hero[]>  {
    if(!term.trim()) {
      return of([]);
    }
    const url = `${this.heroesUrl}/?name=${term}`;
    return this.http.get<Hero[]>(url);
  }

  getHeroes(): Observable<Hero[]> {
    this.log('fetched heroes');
    return this.http.get<Hero[]>(this.heroesUrl);
  }

  getHero(id: number): Observable<Hero> {
    this.log('Get hero');
    const url = `${this.heroesUrl}/${id}`;
    return this.http.get<Hero>(url);
  }

  addHero(hero: Hero): Observable<Hero> {
    this.log('Add hero');
    return this.http.post<Hero>(this.heroesUrl, hero, httpOptions);
  }

  uploadHero(hero: Hero): Observable<any> {
    this.log('Update hero');
    return this.http.put(this.heroesUrl, hero, httpOptions);
  }

  deleteHero(hero: Hero | number): Observable<Hero> {
    this.log('Delete hero');
    const id = (typeof hero === 'number') ? hero : hero.id;
    const url = `${this.heroesUrl}/${id}`;
    return this.http.delete<Hero>(url, httpOptions);
  }

  log(message: string): void {
    this.messageService.addMessage(`HeroService: ${message}`);
  }

}
