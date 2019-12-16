import { Component, ViewChild } from '@angular/core';
import chartJs from 'chart.js';
import { PopoverController, AlertController, ToastController } from '@ionic/angular';
import { MenusDropdownPage } from '../menus-dropdown/menus-dropdown.page';
import { LoadingController } from '@ionic/angular';
import { PeopleService } from '../services/people.service';
import { TokenService } from '../auth/token-service';
import { AccessService } from '../services/access.service';
import { map } from 'rxjs/operators';
import { forEach } from '@angular/router/src/utils/collection';
import { NewsPage } from '../news/news.page';
import { NewsService } from '../services/news.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  nResids0:0
  nResids1:0
  nPosts=0;
  @ViewChild('barCanvas') barCanvas;
  @ViewChild('pieCanvas') pieCanvas;
  barChart:any;
  pieChart:any;
  segment = ''
  email:string;
  roles:string[];
  rolesAuth:any
  authority:string;
  posts:any={}
  form:any={
    id:'',
    text:''
  }
  list:any
  news:any
  search:''
  accesses:any
  accessesP:any=0
  accessesN:any=0
  public pieChartData: number[] = [this.nResids1,this.nResids0];

  constructor(private popoverController: PopoverController, public loadingController: LoadingController,
    private api: PeopleService, private tokeSevice:TokenService,  private apiAccess: AccessService,
    private apiNews: NewsService, private alertController: AlertController, private toastCtrl: ToastController) {}

    showToast(msg){
      this.toastCtrl.create({
        message: msg, duration: 3000
      }).then(toast => toast.present())
    }

  async notifications(ev: any) {
    const popover = await this.popoverController.create({
        component: MenusDropdownPage,
        componentProps: {posts:this.posts, nPosts:this.nPosts, popover:this.popoverController},
        event: ev,
        animated: true,
        showBackdrop: true
    });
    return await popover.present();
}

loadNew(news?){
  if(news){
    console.log(news.id)
    this.form.id=news.id
    console.log(this.form.id)
    this.form.text=news.text
  }else{
    this.form.id=null
    this.form.text = ''
  }
}

async newsPage(ev: any) {
  this.list=''
    const popover = await this.popoverController.create({
      component: NewsPage,
      componentProps:{id: this.form.id, text: this.form.text, popover: this.popoverController},
      event: ev, animated: true, showBackdrop: true
    });
    return await popover.present();
  }

async ionViewWillEnter(){
  this.list='v'
  this.rolesAuth=this.tokeSevice.getAuthorities()
  this.getAccessPN();
  this.loadAll()
  console.log('oi',(this.dateNow()+30))
  this.presentLoading();
  this.getPosts()
  this.getNews()
}

async getAccessPN(){
  await this.apiAccess.getAccessStatus('1', this.dateNow())
    .subscribe( res =>{   
      this.accessesP = res.length
      console.log(this.accessesP)
    }, err => {
      //console.log('Erro: '+err);
    });
    await this.apiAccess.getAccessStatus('0',this.dateNow())
    .subscribe( res =>{   
      this.accessesN = res.length
      console.log(this.accessesN)
    }, err => {
      //console.log('Erro: '+err);
    });
}

dateNow() {
  const date = new Date();

  const ano = date.getFullYear();
  const mes = date.getMonth() + 1;
  const dia = date.getDate();

  return dia.toString().concat('/').concat(mes.toString()).concat('/').concat(ano.toString());
}

async loadAll(){
  await this.api.getResidsSituation('RESIDENT','0')
      .subscribe(res => {
        this.nResids0 = res.length;
        console.log(this.nResids0)
      }, err => {
      });
  await this.api.getResidsSituation('ADMIN','1')
      .subscribe(res => {
        this.nResids1 = res.length;
        console.log(this.nResids1)
      }, err => {
      });
}

async presentLoading() {
  const loading = await this.loadingController.create({
    message: 'Carregando',
    spinner: 'crescent',
    duration: 100
  });
  await loading.present();
}

async getPosts(){
  let status=false
  try{
    await this.api.getMsg(this.tokeSevice.getUsername(), status)
    .subscribe(res => {        
      this.posts = res;
      this.nPosts= res.length
    }, err => {
    });
  }catch{
     console.log('Faça o login com token válido para ser exibido as mensagens')
  }
}

async getNews(){
  try{
    await this.apiNews.getNews(this.search)
    .subscribe(res => {  
      console.log(res)      
      this.news = res;
    }, err => {
    });
  }catch{
     console.log('Faça o login com token válido para ser exibido as mensagens')
  }
}

async deleteNews(news) {
  const alert = await this.alertController.create({
    header: 'Deseja realmente excluir a notícia de '+ news.people.name+' em '+news.dateTime+'?',
    buttons: [
       {
        text: 'Sim',
        handler: data =>{
          this.apiNews.deleteNews(news.id)
          .subscribe(res => {
            this.showToast('Excluido com sucesso!')
            this.getNews();
          }, err => {
            console.log(err);
            this.showToast('Erro ao excluir!')
          });
        }
      }, {text: 'Não'}     
    ]
  })
  await alert.present();
}

  buttonGrafh(){
    if (this.segment === 'bar') {
        this.getBarChart();
    } else {
        this.getPieChart();
    }
  }

  getChart(context, chartType, data, options?){
    return new chartJs(context,{
      data,
      options,
      type:chartType
    })
  }

  getBarChart(){
    const data = {
      labels:['Permitidos', 'Negados'],
      datasets:[{
        label:'Hoje',
        data:[this.accessesP, this.accessesN],
        backgroundColor:[
          'rgb(20, 0, 255)',
         'rgb(190, 66, 52)'
        ],
        borderWidth:1
      }]
    };

    const options = {
      scales:{
        yAxes:[{
          ticks:{
            beginAtZero:true
          }
        }]
      }
    };

    return this.getChart(this.barCanvas.nativeElement, 'bar', data, options)
  }
  getPieChart(){
    var d:number[]=[this.nResids1, this.nResids0]
    const data = {
      labels:['Inativos', 'Ativos'],
      datasets:[{
        data: [this.pieChartData.push(), this.pieChartData.push()],
        backgroundColor:[
          'rgb(255, 0, 127)',
          'rgb(20, 0, 255)'
        ],
      }]
    };

    return this.getChart(this.pieCanvas.nativeElement, 'pie', data)
  }

}
