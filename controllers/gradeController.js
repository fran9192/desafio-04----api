import { db } from '../models/index.js';
import { logger } from '../config/logger.js';
import { studentModel } from '../models/studentModel.js';

const Student = studentModel;

const create = async (req, res) => {
  const student = new Student({
      name: req.body.name,
      subject: req.body.subject,
      type: req.body.type,
      value: req.body.value
  });
  try {
    const data = await student.save();
    res.send(data);
    res.send({ message: 'Grade inserido com sucesso' });
    logger.info(`POST /grade - ${JSON.stringify()}`);
  } catch (error) {
    res
      .status(500)
      .send({ message: error.message || 'Algum erro ocorreu ao salvar' });
    logger.error(`POST /grade - ${JSON.stringify(error.message)}`);
  }
};

const findAll = async (req, res) => {
  const name = req.query.name;

  //condicao para o filtro no findAll
  var condition = name
    ? { name: { $regex: new RegExp(name), $options: 'i' } }
    : {};

  try {
    const students = await Student.find(condition);
    const studentsList = students.map(({ _id, name, subject, type, value }) => {
      return {
        id: _id,
        name,
        subject,
        type,
        value,
      };
    });

    res.send(studentsList);

    logger.info(`GET /grade`);
  } catch (error) {
    res
      .status(500)
      .send({ message: error.message || 'Erro ao listar todos os documentos' });
    logger.error(`GET /grade - ${JSON.stringify(error.message)}`);
  }
};

const findOne = async (req, res) => {
  const id = req.params.id;

  try {
    const student = await Student.findById(id);

    const { _id, name, subject, type, value } = student;

    res.send({
      id: _id,
      name,
      subject,
      type,
      value,
    });

    logger.info(`GET /grade - ${id}`);
  } catch (error) {
    res.status(500).send({ message: 'Erro ao buscar o Grade id: ' + id });
    logger.error(`GET /grade - ${JSON.stringify(error.message)}`);
  }
};

const update = async (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: 'Dados para atualizacao vazio',
    });
  }

  const id = req.params.id;

  try {
    const student = await Student.findOneAndUpdate(id, req.body, {
      new: true,
    });

    if (!!!student) {
      res.status(404).send('Documento não encontrado');
    } else {
      res.send(student);
    }

    logger.info(`PUT /grade - ${id} - ${JSON.stringify(req.body)}`);
  } catch (error) {
    res.status(500).send({ message: 'Erro ao atualizar a Grade id: ' + id });
    logger.error(`PUT /grade - ${JSON.stringify(error.message)}`);
  }
};

const remove = async (req, res) => {
  const id = req.params.id;

  try {
    const student = await Student.findByIdAndDelete({ _id: id });

    if (!!!student) {
      res.status(404).send('Documento não encontrado');
    } else {
      res.sendStatus(200);
    }
    logger.info(`DELETE /grade - ${id}`);
  } catch (error) {
    res
      .status(500)
      .send({ message: 'Nao foi possivel deletar o Grade id: ' + id });
    logger.error(`DELETE /grade - ${JSON.stringify(error.message)}`);
  }
};

const removeAll = async (req, res) => {
  try {
    await Student.deleteMany({});

    res.sendStatus(200);
    
    logger.info(`DELETE /grade`);
  } catch (error) {
    res.status(500).send({ message: 'Erro ao excluir todos as Grades' });
    logger.error(`DELETE /grade - ${JSON.stringify(error.message)}`);
  }
};

export default { create, findAll, findOne, update, remove, removeAll };
