package com.weiquan.service.user;

import com.weiquan.common.WqException;
import com.weiquan.domain.User;

public interface UserService {
	public User validLoginUser(User user) throws WqException;
}
