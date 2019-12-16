import { Component, OnInit } from '@angular/core';
import { TokenService } from '../auth/token-service';
import { AccessService } from '../services/access.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-acessos',
  templateUrl: './acessos.component.html',
  styleUrls: ['./acessos.component.css']
})
export class AcessosComponent implements OnInit {
  accesses:any
  roles:any
  status:any
  search:any
  dateNow:any
  id:any
  constructor(private tokenService: TokenService, private api: AccessService,
    private modalService: NgbModal,
    private toastr: ToastrService) { }

  ngOnInit() {
    this.roles=this.tokenService.getAuthorities()
    this.search=''
    this.status=''
    this.dateNow=''
    this.getAccess();
  }
  

  exportPDF(){
    this.api.exportPDF(this.status, this.search, this.dateNow)
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

  access(id){
    this.id=id
  }

  deleteAccess() {
    this.api.deleteAccess(this.id)
      .subscribe(res => {
          this.getAccess(); 
          this.toastr.success("Acesso Excluido com Sucesso!")
          this.modalService.dismissAll()
          //this.router.navigate(['/usuarios']);
        }, (err) => {
          console.log(err);
        }
      )
  }

  getAccess(){
    console.log(this.status)
    this.api.getAccess(this.status, this.search, this.dateNow)
    .subscribe(res => {     
      console.log(res)    
      this.accesses = res;
    }, err => {
      //console.log('Erro: '+err);
    });
  }

}
