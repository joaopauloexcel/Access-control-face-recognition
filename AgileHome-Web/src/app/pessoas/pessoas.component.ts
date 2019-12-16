import { Component, OnInit } from '@angular/core';
import { People } from '../model/people';
import { Router, ActivatedRoute } from '@angular/router';
import { CepService } from '../services/cep.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { PeopleService } from '../services/people.service';
import { TokenService } from '../auth/token-service';
import { PeopleCrmService } from '../services/people-crm.service';
import { FacialService } from '../services/facial.service';

@Component({
  selector: 'app-pessoas',
  templateUrl: './pessoas.component.html',
  styleUrls: ['./pessoas.component.css']
})
export class PessoasComponent implements OnInit {
  image: any
  pessoas: People[]=[];
  pessoa: People;
  modalTitle: string;
  roles:any
  role:any
  search:any
  userEmail:any
  id:any
  nameMessage:any
  post:any={
    title:'',
    text:'',
    email:''
  }
  form:any={
    title:'',
    text:'',
    name:'',
    receptEmail:'',
    emiterEmail:'',
  }
  constructor(private router: Router,
              private route: ActivatedRoute,
              private peopleService:PeopleService, 
              private servicecep:CepService,
              private modalService: NgbModal,
              private toastr: ToastrService,
              private tokenService: TokenService,
              private peopleCrmService: PeopleCrmService,
              private apiFace: FacialService) {
    this.pessoa = new People();
   }

  ngOnInit() {
    this.userEmail=this.tokenService.getUsername()
    this.roles=this.tokenService.getAuthorities()
    if(this.roles=='RESIDENT' && this.roles=='RESIDENT') this.role="RESIDENT"
    else this.role=""
    this.selectPeople();
    this.getImage(1)
    console.log(this.role)
  }

  addFace(){
    if(this.pessoa.id){
      this.apiFace.addFace(this.pessoa.passwordHome)
      .subscribe(res => {
        this.toastr.success("Detecção Habilitada!")
      }, (err) => {
        if(err=='Detecção habilitada!')
           this.toastr.success("Detecção Habilitada!")
        else this.toastr.error("Erro!")
      })
    }
}

deleteFace(){
  if(this.pessoa.id){
    this.apiFace.deleteFace(this.pessoa.id)
    .subscribe(res => {
      this.toastr.success("Face Excluida!")
    }, (err) => {
      if(err=='Face Excluída!'){
        this.toastr.success("Face Excluída com sucesso!")
      }
        else this.toastr.error("Erro!")
    })
  }
}


  getImage(id){
    this.peopleService.getImage(id)
    .subscribe(res => {
      //this.image=res.data
      console.log(this.image)
      //this.isLoadingResults = false;
    }, err => {
      //console.log(err);
      //this.isLoadingResults = false;
    });
  }

email(name, email){
  this.form.emiterEmail = this.userEmail;
  this.form.name=name
  this.form.receptEmail=email
  this.nameMessage=name
}


sendEmail(){
  this.peopleCrmService.sendEmail(this.form)
  .subscribe(res => {
    this.toastr.success("E-mail com Sucesso!")
     }, (err) => {
       this.toastr.error("Erro!")
     })
}

message(id, name){
  this.post.email = this.tokenService.getUsername();
  this.id=id
  this.nameMessage=name
}

sendMsg(){
  this.peopleCrmService.sendMsg(this.id,this.post)
          .subscribe(res => {
            console.log(res);
            this.toastr.success("Mensagem enviada com Sucesso!")
            }, (err) => {
              this.toastr.error("Erro!")
            })
}

  searchRoles(){
    this.selectPeople()
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

  buscarCep(){
    try{
      if(this.pessoa.zipCode.length==8){
        this.servicecep.getCep(this.pessoa.zipCode)
        .subscribe(res => 
          {
            console.log(JSON.parse(JSON.stringify(res)))
            this.pessoa.hood=JSON.parse(JSON.stringify(res)).bairro
            this.pessoa.city=JSON.parse(JSON.stringify(res)).localidade
            this.pessoa.state=JSON.parse(JSON.stringify(res)).uf
            this.pessoa.street=JSON.parse(JSON.stringify(res)).logradouro
            console.log(this.pessoa)
          }
        )
      }
    }catch{
      console.log('Provavelmente está desconectado da internet')
    }
  }

  selectPeople(){
    this.peopleService.getUser(this.role)
    .subscribe(res => {
      this.pessoas = res;
      console.log(this.pessoas);
      //this.isLoadingResults = false;
    }, err => {
      console.log(err);
      //this.isLoadingResults = false;
    });
  }

  searchUser(){
    this.peopleService.getUserFilterName(this.role, this.search)
      .subscribe(res => {        
        this.pessoas = res;
      }, err => {
        console.log(err);
      });
  }

  save(){
    console.log(this.pessoa)
    if(this.pessoa.id==null){
      this.pessoa.roles[0] = this.role
      this.peopleService.postUser(this.pessoa)
      .subscribe(res => {
        this.toastr.success("Cadastrado efetuado com Sucesso!")
          this.selectPeople(); 
          this.modalService.dismissAll()
        }, (err) => {
          this.toastr.error(err)
        });
    }
    else
    {
      console.log(this.pessoa.id);
      this.pessoa.roles=['']
      this.pessoa.roles[0] = this.role
      this.peopleService.updateUser(this.pessoa.id, this.pessoa)
        .subscribe(res => {
          this.toastr.success("Cadastrado efetuado com Sucesso!")
            this.selectPeople(); 
            this.modalService.dismissAll()
            //this.router.navigate(['/produto-detalhe/' + this._id]);
          }, (err) => {
            this.toastr.error(err)
          }
        )
    }
   }
  updateFace(){

  }

 

  updatePeople(pessoa:People){
    this.peopleService.getRoleOfUser(pessoa.id)
    .subscribe(res => {
      this.role = res.role.toLocaleUpperCase();
      //console.log('passou',this.role)
    }, err => {
      console.log(err);
    });
    this.modalTitle = 'Alterando';
    this.pessoa = pessoa
    console.log(pessoa.id);
  }
  
  deletePeople() {
    console.log(this.pessoa.id);
    this.peopleService.deleteUser(this.pessoa.id)
      .subscribe(res => {
          this.selectPeople(); 
          //this.router.navigate(['/usuarios']);
        }, (err) => {
          console.log(err);
        }
      )
    this.toastr.success("Excluido com Sucesso!")
    this.modalService.dismissAll()
  }

  newPeople(){
    this.modalTitle = 'Cadastrando';
    this.pessoa.id = null
    this.pessoa.name = null
    this.pessoa.email = null
    this.pessoa.zipCode=null
    this.pessoa.passwordApp = null
    this.pessoa.passwordHome = null
    this.pessoa.street = null
    this.pessoa.nStreet = null
    this.pessoa.complement = null
    this.pessoa.hood= null
    this.pessoa.city = null
    this.pessoa.state = null
    this.pessoa.situation=null
    this.pessoa.roles=['']
    //this.selectPeople()
  }
}


