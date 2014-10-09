package com.weiquan.service.newinfo.impl;
import java.util.List;
import org.apache.log4j.Logger;

import com.weiquan.domain.Element;
import com.weiquan.domain.ElementQuery;
import com.weiquan.domain.NewInfo;
import com.weiquan.domain.QueryParam;
import com.weiquan.dao.NewInfoDao;
import com.weiquan.service.newinfo.NewInfoService;
import com.weiquan.service.ServiceCommonInterface;
public class NewInfoServiceImpl implements NewInfoService, ServiceCommonInterface<NewInfo>{
	private Logger logger = Logger.getLogger(NewInfoServiceImpl.class);
	private NewInfoDao newInfoDao;
	@Override
	public NewInfo getInfoById(long id){
		return null;
	}
	@Override
	public NewInfo getInfoById(NewInfo arg){
		return this.newInfoDao.get(arg);
	}
	public List<NewInfo> getListByQueryParam(QueryParam queryParam){
		return null;
	}
	@Override
	public void update(NewInfo arg){
		this.newInfoDao.update(arg);
	}
	@Override
	public void insert(NewInfo arg){
		this.newInfoDao.insert(arg);
	}
	public void setNewInfoDao(NewInfoDao arg){
		this.newInfoDao = arg;
	}
}