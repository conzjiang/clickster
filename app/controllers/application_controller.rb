class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception

  helper_method :current_user, :signed_in?

  private
  def signed_in?
    !!current_user
  end

  def login!(user)
    session[:token] = user.reset_token!
    @current_user = user
  end

  def logout!
    current_user.reset_token!
    session[:token] = nil
  end

  def current_user
    @current_user ||= User.find_by(session_token: session[:token])
  end

  def require_signed_in
    unless signed_in?
      flash[:errors] = ["You must be signed in to perform that action!"]
      redirect_to new_session_url
    end
  end
end
