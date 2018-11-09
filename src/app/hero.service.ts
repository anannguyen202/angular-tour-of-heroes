import { Injectable } from '@angular/core';
import { HEROES } from './mock-heroes';
import { Hero } from './hero';
import { MessageService } from './message.service';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

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

  searchHeroes(term: string): Observable<Hero[]> {
    if (!term.trim()) {
      return of([]);
    }
    const url = `${this.heroesUrl}/?name=${term}`;
    return this.http.get<Hero[]>(url);
  }

  getHeroes(): Observable<Hero[]> {
    this.log('Getting heroes');
    return this.http.get<Hero[]>(this.heroesUrl).pipe(
      tap(_ => this.log("fetched heroes")),
      // this.handleError("Cant get heroes",[])
    );
  }

  getHero(id: number): Observable<Hero> {
    this.log(`Getting hero ${id}`);
    const url = `${this.heroesUrl}/${id}`;
    return this.http.get<Hero>(url).pipe(
      tap((hero: Hero) => this.log(`Get ${hero.name} success`)),
      // this.handleError<Hero>("Cant get hero")
    );
  }

  addHero(hero: Hero): Observable<Hero> {
    this.log('Adding hero');
    return this.http.post<Hero>(this.heroesUrl, hero, httpOptions).pipe(
      tap((hero: Hero) => this.log(`Added hero ${hero.name}`)),
      // this.handleError<Hero>("Cant add hero")
    );
  }

  updateHero(hero: Hero): Observable<any> {
    this.log('Updating hero');
    return this.http.put(this.heroesUrl, hero, httpOptions).pipe(
      tap((hero: Hero) => this.log(`Updated hero ${hero.id}`)),
      // this.handleError("Cant updateHero hero",[])
    );
  }

  deleteHero(hero: Hero | number): Observable<Hero> {
    this.log('Deleting hero');
    const id = (typeof hero === 'number') ? hero : hero.id;
    const url = `${this.heroesUrl}/${id}`;
    return this.http.delete<Hero>(url, httpOptions).pipe(
      tap((hero: Hero) => this.log(`Deleted hero ${hero.id}`)),
      // this.handleError<Hero>("Cant updateHero hero")
    );
  }

  log(message: string): void {
    this.messageService.addMessage(`HeroService: ${message}`);
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error); // log to console instead
      this.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }

}
