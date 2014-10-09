package com.weiquan.service.bussiness.impl;
import java.util.List;
import org.apache.log4j.Logger;
import com.weiquan.domain.Bussiness;
import com.weiquan.domain.Element;
import com.weiquan.domain.ElementQuery;
import com.weiquan.domain.QueryParam;
import com.weiquan.dao.BussinessDao;
import com.weiquan.dao.ElementDao;
import com.weiquan.service.bussiness.BussinessService;
import com.weiquan.service.ServiceCommonInterface;
public class BussinessServiceImpl implements BussinessService, ServiceCommonInterface<Bussiness>{
	private Logger logger = Logger.getLogger(BussinessServiceImpl.class);
	private BussinessDao bussinessDao;

	@Override
	public Bussiness getInfoById(long id){
		return null;
	}
	@Override
	public Bussiness getInfoById(Bussiness arg){
		return this.bussinessDao.get(arg);
	}
	public List<Bussiness> getListByQueryParam(QueryParam queryParam){
		return null;
	}
	@Override
	public void update(Bussiness arg){
		this.bussinessDao.update(arg);
	}
	@Override
	public void insert(Bussiness arg){
		this.bussinessDao.insert(arg);
	}
	public void setBussinessDao(BussinessDao arg){
		this.bussinessDao = arg;
	}
}