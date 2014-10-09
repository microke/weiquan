package com.weiquan.service.user.impl;

import com.weiquan.common.WqException;
import com.weiquan.dao.UserDao;
import com.weiquan.domain.User;
import com.weiquan.service.user.UserService;

public class UserServiceImpl implements UserService{
	private UserDao userDao;
	@Override
	public User validLoginUser(User user) throws WqException {
		User temp = this.userDao.getLoginUser(user);
		if(temp == null){
			throw new WqException("ERROR.USER.NOTEXSIT");
		}
		if(!temp.getPassword().equals(user.getPassword())){
			throw new WqException("ERROR.USER.PASSWORDERROR");
		}
		return temp;
	}
	public void setUserDao(UserDao userDao) {
		this.userDao = userDao;
	}

}
