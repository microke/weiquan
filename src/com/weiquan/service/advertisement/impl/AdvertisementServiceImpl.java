package com.weiquan.service.advertisement.impl;
import java.util.List;
import org.apache.log4j.Logger;
import com.weiquan.domain.Advertisement;
import com.weiquan.domain.Element;
import com.weiquan.domain.ElementQuery;
import com.weiquan.domain.QueryParam;
import com.weiquan.dao.AdvertisementDao;
import com.weiquan.service.advertisement.AdvertisementService;
import com.weiquan.service.element.ElementService;
import com.weiquan.service.element.source.ElementSourceInterface;
import com.weiquan.service.ServiceCommonInterface;
public class AdvertisementServiceImpl implements AdvertisementService, ServiceCommonInterface<Advertisement>{
	private Logger logger = Logger.getLogger(AdvertisementServiceImpl.class);
	private AdvertisementDao advertisementDao;
	
	@Override
	public Advertisement getInfoById(long id){
		return null;
	}
	@Override
	public Advertisement getInfoById(Advertisement arg){
		return this.advertisementDao.get(arg);
	}
	public List<Advertisement> getListByQueryParam(QueryParam queryParam){
		return null;
	}
	
	@Override
	public void update(Advertisement arg){
		this.advertisementDao.update(arg);
	}
	@Override
	public void insert(Advertisement arg){
		this.advertisementDao.insert(arg);
	}
	public void setAdvertisementDao(AdvertisementDao arg){
		this.advertisementDao = arg;
	}

}