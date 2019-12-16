const db = require('../config/db.config.js');
const Access = db.access;
const People = db.people;
var report = require('../report/index')
const Op = db.Sequelize.Op;//resposta opcional de maeamento
var pdf = require('html-pdf');
var options = { format: 'Letter' };

exports.list = (req, res) => {
	if(req.query.status && req.query.search){
        return Access.
		findAll({
            where:{
               status:req.query.status,
            },
            order: [['dateTime', 'DESC']],
            include:{model: People,  
                where:{
                    name:{[Op.like]:`%${req.query.search}%`}   
                }, 
                attributes:['name','email']
            }
		})
		.then((access) => res.status(200).send(access))
		.catch((error) => { res.status(400).send(error); });
    }
    else if(req.query.status){
        return Access.
		findAll({
            where:{
               status:req.query.status,
            },
            order: [['dateTime', 'DESC']],
            include:{model: People,  attributes:['name','email']}
		})
		.then((access) => res.status(200).send(access))
		.catch((error) => { res.status(400).send(error); });
    }
    else if(req.query.search){
		return Access
        .findAll({ 
            order: [['dateTime', 'DESC']],
            include:{model: People,  
                        where:{
                            name:{[Op.like]:`%${req.query.search}%`}   
                        }, 
                        attributes:['name','email']
                    }
        })
        .then((access) => {
        if (!access) {
            return res.status(404).send({message: 'Access Not Found'})
            }
        return res.status(200).send(access);
        }).catch((error) => res.status(400).send(error));
    }
    else if(req.query.dateNow){
		return Access
        .findAll({ 
            where:{
                dateTime:{[Op.like]:`%${req.query.dateNow}%`} 
            },
            order: [['dateTime', 'DESC']],
            include:{model: People, attributes:['name','email']
                    }
        })
        .then((access) => {
        if (!access) {
            return res.status(404).send({message: 'Access Not Found'})
            }
        return res.status(200).send(access);
        }).catch((error) => res.status(400).send(error));
    }
	else{
        return Access.
            findAll({
                attributes:['id','status', 'dateTime'],
                order: [['dateTime', 'DESC']],
                include:{model: People,  attributes:['name', 'email']}
            })
            .then((access) => res.status(200).send(access))
            .catch((error) => { res.status(400).send(error); });
	}	  
}

exports.pdf = (req, res) => {
    console.log('aqui agora')
    if(req.query.status && req.query.search){
       Access.
		findAll({
            where:{
               status:req.query.status,
            },
            order: [['dateTime', 'DESC']],
            include:{model: People,  
                where:{
                    name:{[Op.like]:`%${req.query.search}%`}   
                }, 
                attributes:['name','email']
            }
		})
		.then((access) => {
            const itens = access.length
            const table = access.map((item)=>{
                return `<tr>
                <td>${item.people.name}</td>
                <td>${item.dateTime}</td>
                <td>${item.status=="0"?"Bloqueado":"Liberado"}</td>
                </tr>` 
              }
            ).join('')//junta as informações dos itens
            const html = report.replace('{{table}}', table).replace('{{size}}', itens)
            pdf.create(html, options).toBuffer(function (err, buffer) {
                if (err) return res.send(err);
                res.setHeader('Content-type', 'application/pdf');
                res.type('pdf');
                res.end(buffer, 'binary');
            });
        })
        .catch((error) => { res.status(400).send(error); });
    }
    else if(req.query.status){
        Access.
		findAll({
            where:{
               status:req.query.status,
            },
            order: [['dateTime', 'DESC']],
            include:{model: People,  attributes:['name','email']}
		})
		.then((access) => {
            const itens = access.length
            const table = access.map((item)=>{
                return `<tr>
                <td>${item.people.name}</td>
                <td>${item.dateTime}</td>
                <td>${item.status=="0"?"Bloqueado":"Liberado"}</td>
                </tr>` 
              }
            ).join('')//junta as informações dos itens
            const html = report.replace('{{table}}', table).replace('{{size}}', itens)
            pdf.create(html, options).toBuffer(function (err, buffer) {
                if (err) return res.send(err);
                res.setHeader('Content-type', 'application/pdf');
                res.type('pdf');
                res.end(buffer, 'binary');
            });
        })
        .catch((error) => { res.status(400).send(error); });
    }
    else if(req.query.search){
		Access
        .findAll({ 
            order: [['dateTime', 'DESC']],
            include:{model: People,  
                        where:{
                            name:{[Op.like]:`%${req.query.search}%`}   
                        }, 
                        attributes:['name','email']
                    }
        })
        .then((access) => {
            const itens = access.length
            const table = access.map((item)=>{
                return `<tr>
                <td>${item.people.name}</td>
                <td>${item.dateTime}</td>
                <td>${item.status=="0"?"Bloqueado":"Liberado"}</td>
                </tr>` 
              }
            ).join('')//junta as informações dos itens
            const html = report.replace('{{table}}', table).replace('{{size}}', itens)
            pdf.create(html, options).toBuffer(function (err, buffer) {
                if (err) return res.send(err);
                res.setHeader('Content-type', 'application/pdf');
                res.type('pdf');
                res.end(buffer, 'binary');
            });
        })
        .catch((error) => { res.status(400).send(error); });
    }
    else if(req.query.dateNow){
		Access
        .findAll({ 
            where:{
                dateTime:{[Op.like]:`%${req.query.dateNow}%`} 
            },
            order: [['dateTime', 'DESC']],
            include:{model: People, attributes:['name','email']
                    }
        })
        .then((access) => {
            const itens = access.length
            const table = access.map((item)=>{
                return `<tr>
                <td>${item.people.name}</td>
                <td>${item.dateTime}</td>
                <td>${item.status=="0"?"Bloqueado":"Liberado"}</td>
                </tr>` 
              }
            ).join('')//junta as informações dos itens
            const html = report.replace('{{table}}', table).replace('{{size}}', itens)
            pdf.create(html, options).toBuffer(function (err, buffer) {
                if (err) return res.send(err);
                res.setHeader('Content-type', 'application/pdf');
                res.type('pdf');
                res.end(buffer, 'binary');
            });
        })
        .catch((error) => { res.status(400).send(error); });
    }
	else{
        Access.
            findAll({
                attributes:['id','status', 'dateTime'],
                order: [['dateTime', 'DESC']],
                include:{model: People,  attributes:['name', 'email']}
            })
            .then((access) => {
                const itens = access.length
                const table = access.map((item)=>{
                    return `<tr>
                    <td>${item.people.name}</td>
                    <td>${item.dateTime}</td>
                    <td>${item.status=="0"?"Bloqueado":"Liberado"}</td>
                    </tr>` 
                  },
                  console.log('Cheguei aqui')
                ).join('')//junta as informações dos itens
                const html = report.replace('{{table}}', table).replace('{{size}}', itens)
                pdf.create(html, options).toBuffer(function (err, buffer) {
                    if (err) return res.send(err);
                    res.setHeader('Content-type', 'application/pdf');
                    res.type('pdf');
                    res.end(buffer, 'binary');
                });
            })
            .catch((error) => { res.status(400).send(error); });
	}	 
}

exports.add = (req, res) => {//cadastro de usuários
    if(req.params.id){//id do usuário
            People.findById(req.params.id)//Cria usuario
            .then(people => {
                var dNow = new Date();
                 dNow = dNow.getDate() + '/' + (dNow.getMonth()+1) + '/' +
                 dNow.getFullYear() + ' ' + dNow.getHours() + ':' + 
                 dNow.getMinutes();	
                if(people.situation==='0'){
                    Access.create({//Cria usuario
                        peopleId: people.id,//nome recebe o que foi passado na requisição
                        status: '0', //0 negado - 1 liberado
                        dateTime:dNow
                    }).then(access => {
                        res.status(200).send(access)
                    }).catch(err => {//se erro de gravar usuário
                        res.status(500).send({ reason: err.message });
                    })
                }else if(people.situation==='1'){
                    Access.create({//Cria usuario
                        peopleId: people.id,//nome recebe o que foi passado na requisição
                        status: '1', //0 negado - 1 liberado
                        dateTime:dNow
                    }).then(access => {
                        res.status(200).send(access)
                    }).catch(err => {//se erro de gravar usuário
                        res.status(500).send({ reason: err.message });
                    })
                }
            }).catch(err => {//se erro de gravar usuário
                res.status(500).send({ reason: err.message });
            })
    } return
}

exports.delete = (req, res) => {
    return Access
      .findById(req.params.id)
      .then(access => {
        if (!access) {
          return res.status(400).send({
            message: 'Access Not Found',
          });
        }
		return access
		.destroy()
          .then(() => res.status(200).send())
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  }
