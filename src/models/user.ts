import {
  Sequelize,
  DataTypes,
  Model,
  CreationOptional,
  Optional,
} from "sequelize";

export interface UserAttributes {
  id: string;
  name: string;
  email: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type UserCreationAttributes = Optional<
  UserAttributes,
  "id" | "createdAt" | "updatedAt"
>;
export class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  declare id: CreationOptional<string>;
  declare name: string;
  declare email: string;
  declare readonly createdAt: CreationOptional<Date>;
  declare readonly updatedAt: CreationOptional<Date>;
}

const defineUserModel = (sequelize: Sequelize): typeof User => {
  User.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: { isEmail: true },
      },
    },
    {
      tableName: "users",
      sequelize,
      timestamps: true,
    }
  );

  return User;
};

export default defineUserModel;
