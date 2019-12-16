import { Component, OnInit } from '@angular/core';
import { NewsService } from '../services/news.service';
import { ChartDataSets, ChartType, ChartOptions } from 'chart.js';
import { Label } from 'ng2-charts';
import * as pluginDataLabels from 'chart.js';
import { AccessService } from '../services/access.service';
import { PeopleService } from '../services/people.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { TokenService } from '../auth/token-service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  search:any
  roles:any
  news:any
  accessesP:any
  accessesN:any
  nResids0:any
  nResids1:any
  new:any={
    id:null,
    text:'',
    userEmail:''
  }
  primerTraco=0
  public barChartOptions: ChartOptions = {
    responsive: true,
    scales: { xAxes: [{}], yAxes: [{}] },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
      }
    }
  };
  public barChartLabels: Label[] = ['Acessos'];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [pluginDataLabels];

  public barChartData: ChartDataSets[] = [
    { data: [0,0,0], label: 'Negados' },
    { data: [0,0,0], label: 'Permitidos' }
  ];

  public pieChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      position: 'top',
    },
    plugins: {
      datalabels: {
        formatter: (value, ctx) => {
          const label = ctx.chart.data.labels[ctx.dataIndex];
          return label;
        },
      },
    }
  };

  public pieChartLabels: Label[] = [['Cadastros Ativos'],['Cadastros Inativos']];
  public pieChartData: number[] = [0,0];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;

  public pieChartPlugins = [pluginDataLabels];
  public pieChartColors = [
    {
      backgroundColor: ['rgba(255,0,0,0.3)', 'rgba(0,0,255,0.3)'],
    },
  ];

  constructor(private apiNews:NewsService, private apiAccess:AccessService, private apiPeople:PeopleService,
    private modalService:NgbModal, private toastr: ToastrService, private tokenService: TokenService) { 
  }

  ngOnInit() {
    this.roles=this.tokenService.getAuthorities()
    this.search=''
    setTimeout(()=>{
      console.log('atng',this.nResids1)
      this.barChartData = [
        { data: [this.accessesN,0,this.accessesN+1], label: 'Acessos Negados' },
        { data: [this.accessesP,0,this.accessesP+1], label: 'Acessos Permitidos' }
      ];
      this.pieChartData = [this.nResids1,this.nResids0];
    },1000)
    this.getNews()
    this.getAccessPN()
    this.loadAll()
  }

  getNews(){
    try{
      this.apiNews.getNews(this.search)
      .subscribe(res => {  
        console.log(res)      
        this.news = res;
      }, err => {
      });
    }catch{
       console.log('Faça o login com token válido para ser exibido as mensagens')
    }
  }

  clearNew(){
    this.new.id = ''
    this.new.text=''
  }

  saveNew(){
    this.new.userEmail = this.tokenService.getUsername()
    this.apiNews.saveNews(this.new,this.new.id)
    .subscribe(res => {
      this.toastr.success("Notícia inserida com Sucesso!")
      this.modalService.dismissAll()
      this.new.text=''
      this.new.id=''
      this.getNews()
      }, (err) => {
        this.toastr.success("Notícia com erro!")
      })
  }

  updateNew(n){
    this.new.id = n.id
    this.new.text=n.text
  }

  dateNow() {
    const date = new Date();
  
    const ano = date.getFullYear();
    const mes = date.getMonth() + 1;
    const dia = date.getDate();
  
    return dia.toString().concat('/').concat(mes.toString()).concat('/').concat(ano.toString());
  }

  getAccessPN(){
       this.apiAccess.getAccess('1', '', this.dateNow())
      .subscribe( res =>{   
        this.accessesP = res.length
        console.log('acPer',this.accessesP)
      }, err => {
        //console.log('Erro: '+err);
      });
      this.apiAccess.getAccess('0', '', this.dateNow())
      .subscribe( res =>{   
        this.accessesN = res.length
        console.log('acNeg',this.accessesN)
      }, err => {
        //console.log('Erro: '+err);
      });
  }

  loadAll(){
        this.apiPeople.getResidsSituation('RESIDENT','0')
        .subscribe(res => {
          this.nResids0 = res.length;
          console.log('bloq',this.nResids0)
        }, err => {
        });
        this.apiPeople.getResidsSituation('RESIDENT','1')
        .subscribe(res => {
          this.nResids1 = res.length;
          console.log('ati',this.nResids1)
        }, err => {
        });
  }

  deleteNews(){
    this.apiNews.deleteNews(this.new.id)
    .subscribe(res => {
      this.getNews();
      this.toastr.success("Excluido com Sucesso!")
      this.modalService.dismissAll()
    }, err => {
      console.log(err);
    });
  }

  addSlice() {
    this.pieChartLabels.push(['Line 1', 'Line 2']);
    this.pieChartData.push(400);
    this.pieChartColors[0].backgroundColor.push('rgba(196,79,244,0.3)');
  }
    
  removeSlice() {
    this.pieChartLabels.pop();
    this.pieChartData.pop();
    this.pieChartColors[0].backgroundColor.pop();
  }
    
  changeLegendPosition() {
    this.pieChartOptions.legend.position = this.pieChartOptions.legend.position === 'left' ? 'top' : 'left';
  }

  public chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  public chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  open(content) {
    this.modalService.open(content, { backdrop : 'static'});
  }

  openLg(content) {
    this.modalService.open(content, { size: 'lg', backdrop : 'static'});
  }

  showSuccess(msn) {
    this.toastr.success(msn);
  }

  showError(msn) {
    this.toastr.error(msn);
  }

}
