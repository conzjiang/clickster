class AddFbCredentialsToUsers < ActiveRecord::Migration
  def change
    add_column :users, :uid, :string, index: true
    add_column :users, :provider, :string, index: true
  end
end
