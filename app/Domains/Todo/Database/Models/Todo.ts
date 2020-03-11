import { Table, Model, Column, AutoIncrement } from 'sequelize-typescript';

@Table({
  timestamps: true,
})
export class Todo extends Model<Todo> {
  @AutoIncrement
  public id: number;

  @Column
  public text: string;
}
