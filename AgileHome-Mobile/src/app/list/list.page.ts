import { Component, OnInit } from '@angular/core';
import { PeopleService } from '../services/people.service';
import { TokenService } from '../auth/token-service';

@Component({
  selector: 'app-list',
  templateUrl: 'list.page.html',
  styleUrls: ['list.page.scss']
})
export class ListPage implements OnInit {
  peoples: any
  search=''
  segment = 'RESIDENT'
  roles:any
  constructor(public api: PeopleService, private tokenService: TokenService) {}

  ngOnInit() {
    this.getPeople()
  }

  async ionViewWillLeave(){//antes da página deixar de ser ativa, evento 
    this.search='';
  }

  async ionViewWillEnter(){//antes da página deixar de ser ativa, evento 
    this.roles = this.tokenService.getAuthorities();
    this.getPeople()
  }

  async getPeople() {
    await this.api.getUser(this.segment)
      .subscribe(res => {
        this.peoples = res;
        this.search=''
      }, err => {
        console.log(err);
      });
  }

  async searchUser(){
    await this.api.getUserFilterName(this.segment, this.search)
      .subscribe(res => {        
        this.peoples = res;
      }, err => {
        console.log(err);
      });
  }
  // add back when alpha.4 is out
  // navigate(item) {
  //   this.router.navigate(['/list', JSON.stringify(item)]);
  // }
}
