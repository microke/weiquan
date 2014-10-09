package com.weiquan.service.index;

import com.weiquan.domain.CommonIndex;
import com.weiquan.domain.User;

public interface IndexService {
	public void assess(CommonIndex commonIndex, User user);
	public void cancelAssess(CommonIndex commonIndex, User user);
	
	public void addDisscuss(CommonIndex commonIndex, User user);
}
