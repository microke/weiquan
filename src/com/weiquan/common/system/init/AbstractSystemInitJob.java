package com.weiquan.common.system.init;

import org.apache.log4j.Logger;

import com.weiquan.common.WqException;

public abstract class AbstractSystemInitJob implements SystemInitJob{
	private Logger logger = Logger.getLogger(AbstractSystemInitJob.class);
	private int systemJobLevel = SystemInitJob.SYSTEM_JOB_LEVEL_DEFAULT;
	
	protected abstract void doSystemJob() throws Exception;
	
	@Override
	public void doJob() throws Exception{
		try{
			this.doSystemJob();
		}catch(Exception e){
			this.logger.error("System job failured!", e);
			if(this.systemJobLevel == SystemInitJob.SYSTEM_JOB_LEVEL_ERROR){
				throw e;
			}
		}
	}

	@Override
	public int getSystemJobLevel() {
		return this.systemJobLevel;
	}

	protected void setSystemJobLevel(int systemJobLevel) {
		
		this.systemJobLevel = systemJobLevel;
	}
	
	
}
