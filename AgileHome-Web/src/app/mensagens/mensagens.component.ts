import { Component, OnInit } from '@angular/core';
import { TokenService } from '../auth/token-service';
import { PeopleCrmService } from '../services/people-crm.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-mensagens',
  templateUrl: './mensagens.component.html',
  styleUrls: ['./mensagens.component.css']
})
export class MensagensComponent implements OnInit {
  messages:any
  email:any
  status:any
  search:any
  constructor(private tokenService: TokenService, private api: PeopleCrmService,
    private modalService: NgbModal,
    private toastr: ToastrService) { }

  ngOnInit() {
    this.email=this.tokenService.getUsername()
    console.log(this.email)
    this.search=''
    this.status=''
    this.getMessage();
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

  getMessage(){
    console.log(this.status)
    this.api.getMsg(this.email,this.status, this.search)
    .subscribe(res => {     
      console.log(res)    
      this.messages = res;
    }, err => {
      //console.log('Erro: '+err);
    });
  }

  markSeen(id){
      console.log(id)
      this.api.markSeenMessage(id)
      .subscribe(res => {
        this.getMessage()
        this.toastr.success("Mensagem marcada como lida com Sucesso!")
        }, (err) => {
          this.toastr.success("Erro!")
        })
  }

}
