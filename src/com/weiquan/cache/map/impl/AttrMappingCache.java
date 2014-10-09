package com.weiquan.cache.map.impl;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.util.Map;

import org.apache.log4j.Logger;

import com.sun.org.apache.xalan.internal.xsltc.trax.OutputSettings;
import com.weiquan.cache.map.AbstractMapCache;
import com.weiquan.common.WqDataDictionary;
import com.weiquan.common.WqException;
import com.weiquan.domain.AttrMapping;
import com.weiquan.service.attrmapping.AttrMappingCacheInitInterface;
import com.weiquan.util.JsonUtil;

public class AttrMappingCache extends AbstractMapCache<AttrMapping>{
	
	private final Logger logger = Logger.getLogger(AttrMappingCache.class);
	private AttrMappingCacheInitInterface attrMappingService;
	private String localJsFilePath = "E://workspace//tempFile//attrMappingContext.js";
	private String charset = WqDataDictionary.SYSTEM_CHARSET;
	
	@Override
	public void initCache() throws Exception {
		logger.info("init attrMappingCache begin.");
		super.data = this.attrMappingService.initAttrMapping();
		this.initJsFile();
		logger.info("init attrMappingCache finished.");
	}
	
	public void initJsFile() throws Exception{
		this.logger.info("init attrMapping JS File beign..");
		StringBuilder sbr = new  StringBuilder();
		sbr.append("var wqSysAttrMapping = ").append(JsonUtil.toJsonObject(super.data)).append(";");
		
		this.logger.info("create js fileContext["+sbr.toString()+"]");
		File file = new File(this.localJsFilePath);
		if(!file.exists()){
			if(!file.createNewFile()){
				logger.error("attrMapping JS failured");
				throw new WqException("ERROR.ATTRMAPPING.JSFAILURED");
			}
		}
		
		OutputStream out = null;
		try{
			 out = new FileOutputStream(file);
			out.write(sbr.toString().getBytes(this.charset));
			out.flush();
		}finally{
			if(out != null){
				out.close();
			}
		}
		this.logger.info("init attrMapping JS File finished..");
	}
	
	public void setAttrMappingService(
			AttrMappingCacheInitInterface attrMappingService) {
		this.attrMappingService = attrMappingService;
	}

	public void setLocalJsFilePath(String localJsFilePath) {
		this.localJsFilePath = localJsFilePath;
	}

	public void setCharset(String charset) {
		this.charset = charset;
	}
}
