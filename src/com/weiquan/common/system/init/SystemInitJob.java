package com.weiquan.common.system.init;

public interface SystemInitJob {
	public static final int SYSTEM_JOB_LEVEL_DEFAULT = 0;
	public static final int SYSTEM_JOB_LEVEL_ERROR = 1;
	public static final int SYSTEM_JOB_LEVEL_WARN = 2;
	
	public void doJob() throws Exception;
	public int getSystemJobLevel();
}
