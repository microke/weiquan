package com.weiquan.service.sysattribute.impl;
import java.util.List;
import org.apache.log4j.Logger;
import com.weiquan.domain.SysAttribute;
import com.weiquan.domain.QueryParam;
import com.weiquan.dao.SysAttributeDao;
import com.weiquan.service.sysattribute.SysAttributeService;
import com.weiquan.service.ServiceCommonInterface;
public class SysAttributeServiceImpl implements SysAttributeService, ServiceCommonInterface<SysAttribute>{
	private Logger logger = Logger.getLogger(SysAttributeServiceImpl.class);
	private SysAttributeDao sysAttributeDao;

	@Override
	public SysAttribute getInfoById(long id){
		return null;
	}
	@Override
	public SysAttribute getInfoById(SysAttribute arg){
		return this.sysAttributeDao.get(arg);
	}
	public List<SysAttribute> getListByQueryParam(QueryParam queryParam){
		return null;
	}
	@Override
	public void update(SysAttribute arg){
		this.sysAttributeDao.update(arg);
	}
	@Override
	public void insert(SysAttribute arg){
		this.sysAttributeDao.insert(arg);
	}
	public void setSysAttributeDao(SysAttributeDao arg){
		this.sysAttributeDao = arg;
	}
}