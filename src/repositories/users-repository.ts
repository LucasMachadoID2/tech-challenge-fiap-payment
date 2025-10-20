import * as UsersModel from "../models/users-model";
import prisma from "../config/prisma";

//Resgata todos os usuários
export const findAllUsers = async (): Promise<UsersModel.User[]> => {
  try {
    const users: UsersModel.User[] = await prisma.user.findMany();
    return users;
  } catch (error) {
    console.error("❌ Erro em findAllUsers -> Falha ao buscar usuários:", error);
    throw error;
  }
};

//Resgata usuário específico
export const findUsersByEmail = async (email: string): Promise<UsersModel.User[]> => {
  try {
    const users: UsersModel.User[] = await prisma.user.findMany({
      where: {
        email,
      },
    });
    return users;
  } catch (error) {
    console.error("❌ Erro em findUsersByEmail -> Falha ao buscar usuários:", error);
    throw error;
  }
};

//Inserre um usuário
export const insertUser = async (body: UsersModel.CreateUserDTO): Promise<UsersModel.User> => {
  const user: UsersModel.User = await prisma.user.create({
    data: body,
  });
  return user;
};

//Deleta um usuário
export const deleteUser = async (email: string): Promise<UsersModel.User> => {
  const user: UsersModel.User = await prisma.user.delete({
    where: {
      email,
    },
  });
  return user;
};

//Atualiza um usuário
export const updateUser = async (email: string, body: Partial<UsersModel.CreateUserDTO>): Promise<UsersModel.User> => {
  const user: UsersModel.User = await prisma.user.update({
    where: {
      email,
    },
    data: {
      ...body,
    },
  });
  prisma.$disconnect();
  return user;
};
