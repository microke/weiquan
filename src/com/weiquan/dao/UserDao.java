package com.weiquan.dao;

import com.weiquan.domain.User;

public interface UserDao extends WqAbstractDao<User>{
	public User getLoginUser(User user);
}
