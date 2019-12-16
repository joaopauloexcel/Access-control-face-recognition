import { Component, OnInit } from '@angular/core';
import { AlertController, PopoverController } from '@ionic/angular';
import { PeopleService } from '../services/people.service';
import { ActivatedRoute, Router } from '@angular/router';
import { People } from '../model/people';
import { FormBuilder, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { TokenService } from '../auth/token-service';
import { SendmessagesPage } from '../sendmessages/sendmessages.page';
import { SendemailsPage } from '../sendemails/sendemails.page';
import { FacialService } from '../services/facial.service';

@Component({
  selector: 'app-detail-usuario',
  templateUrl: './detail-usuario.page.html',
  styleUrls: ['./detail-usuario.page.scss'],
})

export class DetailUsuarioPage implements OnInit {
  public peopleForm: any;
  role=''; roles:any[]=[]
  emailValid = '^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$';
  messageName = "";  messageEmail = "";  messagePasswordHome = "";  messagePasswordApp = "";  messageRole = "";  messageSituation = "";
  errorName = false;  errorEmail = false;  errorPasswordHome = false;  errorPasswordApp = false;  errorRole = false;  errorSituation = false;
  people: People; userEmail:any
  segment:any='d'

  constructor(public api: PeopleService, public apiFace:FacialService, private alertController:AlertController, 
    private toastCtrl: ToastController, public route: ActivatedRoute,
    public router: Router, private tokenService: TokenService, private popoverController: PopoverController, public formBuilder: FormBuilder) 
    {
      this.people = new People(); 
      this.peopleForm = formBuilder.group({
        name: ['', Validators.required], email: ['', [Validators.required, Validators.pattern(this.emailValid)]],
        role: ['', Validators.required], situation: ['', Validators.required],
        passwordApp: ['', Validators.compose([Validators.minLength(5), Validators.required])],
        passwordHome: ['', Validators.compose([Validators.minLength(5), Validators.required])],
        city: [''], street: [''], zipCode: [''],  nStreet: [''], complement: [''], hood: [''], state: [''],
      });
    }

  ngOnInit() {}

  showToast(msg){
    this.toastCtrl.create({
      message: msg, duration: 3000
    }).then(toast => toast.present())
  }

  async getCep(){
    console.log('oi')
    await this.api.getCep(this.people.zipCode)
    .subscribe(res=>{
      this.people.street = res.logradouro
      this.people.city = res.localidade
      this.people.complement = res.complemento
      this.people.hood = res.bairro
      this.people.state = res.uf
    },err=>{
      console.log('Cep não localizado')
    })
  }

  async ionViewWillEnter() {
    this.userEmail=this.tokenService.getUsername();
    this.roles = this.tokenService.getAuthorities();//lê a atual permissão do usuário
    let parameter = await this.route.snapshot
      .paramMap.get('id');
      console.log(parameter.length)
      if(parameter.length==1){
        await this.api.getUserById(parameter)
        .subscribe(res => {
          this.people.id = res.id; this.people.name = res.name;
          this.people.email = res.email; this.people.street = res.street;
          this.people.nStreet = res.nStreet; this.people.zipCode = res.zipCode;
          this.people.hood = res.hood; this.people.city = res.city;
          this.people.complement = res.complement; this.people.state = res.state;
          this.people.passwordHome = res.passwordHome; this.people.passwordApp = res.passwordApp;
          this.people.situation = res.situation
          this.people.faces = res.faces
        }, err => {
          console.log(err);
        });
        await this.api.getRoleOfUser(parameter)
        .subscribe(res => {
          this.role = res.role.toLocaleUpperCase();
        }, err => {
          console.log(err);
        });
      }
      else{
        this.role = parameter
        console.log(this.role)
      }
  }

  async sendMsg(ev: any) {
        const popover = await this.popoverController.create({
        component: SendmessagesPage,
        componentProps:{id: this.people.id, name: this.people.name, popover: this.popoverController},
        event: ev, animated: true, showBackdrop: true
    });
    return await popover.present();
}

async sendEmail(ev: any) {
  const popover = await this.popoverController.create({
      component: SendemailsPage,
      componentProps:{id: this.people.id,name: this.people.name, email: this.people.email, popover: this.popoverController},
      event: ev, animated: true, showBackdrop: true
  });
  return await popover.present();
}
  
  async clearErrors(){
    this.errorName = false; this.errorEmail = false; this.errorPasswordHome = false; this.errorPasswordApp = false;
  }

  async save(){
    let {name, email, role, passwordApp, passwordHome, situation } = this.peopleForm.controls;
    if(this.peopleForm.valid){
      if(this.people.id){
        this.people.roles[0] = this.role
        await this.api.updateUser(this.route.snapshot.paramMap.get('id'), this.people)
        .subscribe(res => {
            this.clearErrors();
            this.showToast('Alterado com sucesso!')
            this.router.navigate(['/list']);
          }, (err) => {
            this.showToast(err)
          });
      }
      else{
        this.people.roles[0]=this.role
        await this.api.postUser(this.people)
        .subscribe(res => {
          this.clearErrors();
          this.showToast('Adicionado com sucesso!')
          this.router.navigate(['/list']);
          }, (err) => {
            this.showToast(err)
          });
      }
    }
    else{
      if (!name.valid) {
        this.errorName = true; this.messageName = "Insira o nome!";
      } else {
        this.messageName = "";
      }
      if (!email.valid) {
        this.errorEmail = true; this.messageEmail = "Ops! Email inválido";
      } else {
        this.messageEmail = "";
      }
      if (!role.valid) {
        this.errorRole = true; this.messageRole = "Insira o tipo do cadastro!";
      } else {
        this.messageRole = "";
      }
      if (!situation.valid) {
        this.errorSituation = true; this.messageSituation = "Defina a situação do cadastro!";
      } else {
        this.messageSituation = "";
      }
 
      if (!passwordApp.valid) {
        this.errorPasswordApp = true; this.messagePasswordApp ="A senha precisa ter no mínimo 6 caracteres"
      } else {
        this.messagePasswordApp = "";
      }

      if (!passwordHome.valid) {
        this.errorPasswordHome = true; this.messagePasswordHome = "A senha precisa ter no mínimo 6 caracteres";
      } else {
        this.messagePasswordHome = "";
      }
    }
  }

  async addFace(){
      if(this.people.id){
        await this.apiFace.addFace(this.people.passwordHome)
        .subscribe(res => {
            this.clearErrors();
            this.showToast('Detecção habilitada!')
            this.router.navigate(['/list']);
          }, (err) => {
            this.showToast(err)
            this.router.navigate(['/list']);
          });
      }
  }

  async deleteFace(){
    if(this.people.id){
      await this.apiFace.deleteFace(this.people.id)
      .subscribe(res => {
          this.clearErrors();
          this.showToast('Face excluída!')
          this.router.navigate(['/list']);
        }, (err) => {
          this.showToast(err)
          this.router.navigate(['/list']);
        });
    }
}

  async delete(id) {
    const alert = await this.alertController.create({
      header: 'Deseja realmente excluir: '+ this.people.name+'?',
      buttons: [
         {
          text: 'Sim',
          handler: data =>{
            this.api.deleteUser(id)
            .subscribe(res => {
              this.showToast('Excluido com sucesso!')
              this.router.navigate(['/list']);
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
}