package com.weiquan.common.mybatis.typeHandler;

import java.sql.CallableStatement;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import org.apache.ibatis.type.JdbcType;
import org.apache.ibatis.type.MappedJdbcTypes;
import org.apache.ibatis.type.MappedTypes;
import org.apache.ibatis.type.TypeHandler;

@MappedTypes({String.class})
@MappedJdbcTypes({JdbcType.VARCHAR})
public class FixedValueTypeHandler  implements TypeHandler{

	 @Override    
	    public Object getResult(ResultSet rs, String columnName) throws SQLException {    
	        // TODO Auto-generated method stub    
	        System.out.println("getResult(rs,columnName)");    
	        return rs.getString(columnName);    
	    }    
	    
	    @Override    
	    public Object getResult(CallableStatement arg0, int arg1)    
	            throws SQLException {    
	        // TODO Auto-generated method stub    
	        return null;    
	    }    
	    
	    @Override    
	    public void setParameter(PreparedStatement ps, int paraIndex, Object object,    
	            JdbcType jt) throws SQLException {    
	        // TODO Auto-generated method stub    
	        System.out.println("setParameter()");    
	        ps.setString(paraIndex, (String)object);    
	    }

		@Override
		public Object getResult(ResultSet rs, int columnIndex)
				throws SQLException {
			 System.out.println("getResult()");    
			return null;
		}    

}
