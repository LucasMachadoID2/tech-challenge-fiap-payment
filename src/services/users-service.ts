import { HttpResponse } from "../models/http-response-model";
import * as UsersModel from "../models/users-model";
import * as UsersRepository from "../repositories/users-repository";
import * as HttpHelper from "../utils/http-helper";

export const getUsers = async (): Promise<HttpResponse> => {
  try {
    const data: UsersModel.User[] = await UsersRepository.findAllUsers();
    let response = null;
    data.length > 0 ? (response = HttpHelper.ok(data)) : (response = HttpHelper.noContent());
    return response;
  } catch (error) {
    console.error("❌ Erro em getUsers -> Falha ao buscar usuários:", error);
    return HttpHelper.serverError();
  }
};

export const getUserByEmail = async (email: string): Promise<HttpResponse> => {
  try {
    const data: UsersModel.User[] = await UsersRepository.findUsersByEmail(email);
    let response = null;
    data.length > 0 ? (response = HttpHelper.ok(data)) : (response = HttpHelper.noContent());
    return response;
  } catch (error) {
    console.error("❌ Erro em getUserByEmail -> Falha ao buscar usuários:", error);
    return HttpHelper.serverError();
  }
};

export const postUser = async (body: UsersModel.CreateUserDTO): Promise<HttpResponse> => {
  const data: UsersModel.User = await UsersRepository.insertUser(body);
  let response = null;
  data ? (response = await HttpHelper.ok(data)) : (response = await HttpHelper.noContent());
  return response;
};

export const deleteUser = async (email: string): Promise<HttpResponse> => {
  const data: UsersModel.User = await UsersRepository.deleteUser(email);
  let response = null;
  data ? (response = await HttpHelper.ok(data)) : (response = await HttpHelper.noContent());
  return response;
};

export const updateUser = async (email: string, body: Partial<UsersModel.CreateUserDTO>): Promise<HttpResponse> => {
  const data: UsersModel.User = await UsersRepository.updateUser(email, body);
  let response = null;
  data ? (response = await HttpHelper.ok(data)) : (response = await HttpHelper.noContent());
  return response;
};
