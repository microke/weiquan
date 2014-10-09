package com.weiquan.common;

public class WqException extends RuntimeException{
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private String[] args;
	
	public static void argNullCheck(Object ... objs) throws WqException{
		for(Object obj : objs){
			if(obj == null){
				throw new WqException("ERROR.ARG.NULL");
			}
		}
	}
	
	  public WqException(String paramString)
	  {
	    super(paramString);
	  }

	  public WqException(String paramString, Throwable paramThrowable)
	  {
	    super(paramString, paramThrowable);
	  }

	  public String getMessage()
	  {
	    String str = super.getMessage();
	    return str;
	  }

	  public WqException(String paramString, String[] paramArrayOfString)
	  {
	    super(paramString);
	    this.args = paramArrayOfString == null ? null : paramArrayOfString.clone();
	  }

	  public String[] getArgs()
	  {
	    return this.args == null ?null :args.clone();
	  }

	  public void setArgs(String[] paramArrayOfString)
	  {
	    this.args = paramArrayOfString == null ? null:paramArrayOfString.clone();
	  }
}
