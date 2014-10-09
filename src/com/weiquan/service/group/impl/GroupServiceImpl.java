package com.weiquan.service.group.impl;

import java.util.List;

import com.weiquan.dao.ElementDao;
import com.weiquan.dao.GroupDao;
import com.weiquan.domain.Element;
import com.weiquan.domain.ElementQuery;
import com.weiquan.domain.Group;
import com.weiquan.domain.QueryParam;
import com.weiquan.service.ServiceCommonInterface;
import com.weiquan.service.element.source.ElementSourceInterface;

public class GroupServiceImpl implements ServiceCommonInterface<Group>{
	private GroupDao groupDao;
	
	@Override
	public Group getInfoById(long id) {
		return this.groupDao.get( new Group(id));
	}

	@Override
	public Group getInfoById(Group arg) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public List<Group> getListByQueryParam(QueryParam queryParam) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public void update(Group arg) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void insert(Group arg) {
		// TODO Auto-generated method stub
		
	}

	public GroupDao getGroupDao() {
		return groupDao;
	}

	public void setGroupDao(GroupDao groupDao) {
		this.groupDao = groupDao;
	}

}
