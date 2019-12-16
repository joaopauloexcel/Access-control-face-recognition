import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-treinamento',
  templateUrl: './treinamento.component.html',
  styleUrls: ['./treinamento.component.css']
})
export class TreinamentoComponent implements OnInit {

  url:string='https://www.youtube.com/embed/CL0jMJrPIWw'
  titulo:string=''

  constructor(private modalService: NgbModal) { }

  ngOnInit() {
  }

  openLg(content,url,titulo) {
    this.url=url
    this.titulo=titulo
    this.modalService.open(content, { size: 'lg', backdrop : 'static'});
  }

}
