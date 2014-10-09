package com.weiquan.service.image.impl;
import java.util.List;
import org.apache.log4j.Logger;
import com.weiquan.domain.Image;
import com.weiquan.domain.QueryParam;
import com.weiquan.dao.ImageDao;
import com.weiquan.service.image.ImageService;
import com.weiquan.service.ServiceCommonInterface;
public class ImageServiceImpl implements ImageService, ServiceCommonInterface<Image>{
	private Logger logger = Logger.getLogger(ImageServiceImpl.class);
	private ImageDao imageDao;

	@Override
	public Image getInfoById(long id){
		return null;
	}
	@Override
	public Image getInfoById(Image arg){
		return this.imageDao.get(arg);
	}
	public List<Image> getListByQueryParam(QueryParam queryParam){
		return null;
	}
	@Override
	public void update(Image arg){
		this.imageDao.update(arg);
	}
	@Override
	public void insert(Image arg){
		this.imageDao.insert(arg);
	}
	public void setImageDao(ImageDao arg){
		this.imageDao = arg;
	}
}