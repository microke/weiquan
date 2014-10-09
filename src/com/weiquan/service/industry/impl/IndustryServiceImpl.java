package com.weiquan.service.industry.impl;
import java.util.List;
import org.apache.log4j.Logger;
import com.weiquan.domain.Industry;
import com.weiquan.domain.QueryParam;
import com.weiquan.dao.IndustryDao;
import com.weiquan.service.industry.IndustryService;
import com.weiquan.service.ServiceCommonInterface;
public class IndustryServiceImpl implements IndustryService, ServiceCommonInterface<Industry>{
	private Logger logger = Logger.getLogger(IndustryServiceImpl.class);
	private IndustryDao industryDao;

	@Override
	public Industry getInfoById(long id){
		return null;
	}
	@Override
	public Industry getInfoById(Industry arg){
		return this.industryDao.get(arg);
	}
	public List<Industry> getListByQueryParam(QueryParam queryParam){
		return null;
	}
	@Override
	public void update(Industry arg){
		this.industryDao.update(arg);
	}
	@Override
	public void insert(Industry arg){
		this.industryDao.insert(arg);
	}
	public void setIndustryDao(IndustryDao arg){
		this.industryDao = arg;
	}
}