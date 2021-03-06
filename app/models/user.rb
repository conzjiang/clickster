class User < ActiveRecord::Base
  validates :username, :email, presence: true, uniqueness: true
  validates :password_digest, presence: true
  validates :password, length: { minimum: 6, allow_nil: true }
  
  has_attached_file :photo, styles: {
      big: "360x360>",
      medium: "160x200#",
      thumb: "50x50#"
    }, default_url: "/images/missing_:style.jpg"
  validates_attachment_content_type :photo, :content_type => /\Aimage\/.*\Z/

  has_many :watchlists, dependent: :destroy
  has_many :watchlist_shows, through: :watchlists, source: :tv_show

  has_many :favorites, dependent: :destroy
  has_many :favorite_shows, through: :favorites, source: :tv_show

  # PEOPLE THEY FOLLOW
  has_many :follows, foreign_key: :follower_id, dependent: :destroy
  has_many :idols, through: :follows, inverse_of: :followers

  # PEOPLE WHO FOLLOW THEM
  has_many :followings, 
    class_name: "Follow", 
    foreign_key: :idol_id, 
    dependent: :destroy
  has_many :followers, through: :followings, inverse_of: :idols
  
  has_many :posts, inverse_of: :user, dependent: :destroy
  
  has_many :comments, 
    foreign_key: :commenter_id, 
    inverse_of: :commenter, 
    dependent: :destroy
  
  has_many :tv_shows,
    foreign_key: :admin_id,
    inverse_of: :admin
    
  before_destroy :release_admin
  
  include PgSearch
  multisearchable against: [:username, :email]
  
  def currently_watching_shows
    TvShow.joins(:watchlists).where(
      "watchlists.user_id = #{self.id} AND 
      watchlists.status = 'Currently Watching'"
    )
  end
  
  def plan_to_watch_shows
    TvShow.joins(:watchlists).where(
      "watchlists.user_id = #{self.id} AND 
      watchlists.status = 'Plan to Watch'"
    )
  end
  
  def completed_shows
    TvShow.joins(:watchlists).where(
      "watchlists.user_id = #{self.id} AND 
      watchlists.status = 'Completed'"
    )
  end
  
  def dropped_shows
    TvShow.joins(:watchlists).where(
      "watchlists.user_id = #{self.id} AND 
      watchlists.status = 'Dropped'"
    )
  end
  
  def watchlist_statuses
    if @watchlist_hash.nil?
      @watchlist_hash = {}
      
      self.watchlists.each do |watch|
        @watchlist_hash[watch.tv_show_id] = watch.status 
      end
    end
    
    @watchlist_hash
  end

  def password
    @password
  end

  def password=(pass)
    @password = pass
    self.password_digest = BCrypt::Password.create(pass)
  end

  def reset_token!
    self.session_token = SecureRandom.urlsafe_base64(16)
    self.save!
    self.session_token
  end

  def self.find_by_credentials(username, pass)
    user = User.find_by(username: username)
    return unless user

    user.is_password?(pass) ? user : nil
  end

  def is_password?(pass)
    BCrypt::Password.new(self.password_digest).is_password?(pass)
  end
  
  private
  def release_admin
    self.tv_shows.each do |show|
      show.admin_id = nil
      show.save!
    end
  end
end
