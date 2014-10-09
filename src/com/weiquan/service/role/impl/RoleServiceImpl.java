package com.weiquan.service.role.impl;
import java.util.List;
import org.apache.log4j.Logger;

import com.weiquan.common.WqCommonUtil;
import com.weiquan.common.WqDataDictionary;
import com.weiquan.domain.Role;
import com.weiquan.domain.QueryParam;
import com.weiquan.dao.RoleDao;
import com.weiquan.service.role.RoleService;
import com.weiquan.service.ServiceCommonInterface;
public class RoleServiceImpl implements RoleService, ServiceCommonInterface<Role>{
	private Logger logger = Logger.getLogger(RoleServiceImpl.class);
	private RoleDao roleDao;
	
	@Override
	public boolean hasBackgroudPower(Role role) {
		WqCommonUtil.validNullObject(role);
		return WqDataDictionary.ROLE_BACKGROUD_PW == (WqDataDictionary.ROLE_BACKGROUD_PW & role.getRolePower()) ;
	}
	
	@Override
	public Role getInfoById(long id){
		return null;
	}
	@Override
	public Role getInfoById(Role arg){
		return this.roleDao.get(arg);
	}
	public List<Role> getListByQueryParam(QueryParam queryParam){
		return null;
	}
	@Override
	public void update(Role arg){
		this.roleDao.update(arg);
	}
	@Override
	public void insert(Role arg){
		this.roleDao.insert(arg);
	}
	public void setRoleDao(RoleDao arg){
		this.roleDao = arg;
	}
}