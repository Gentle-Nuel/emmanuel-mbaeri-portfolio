import sys, pandas as pd, numpy as np
df = pd.read_pickle(sys.argv[1])
def st(g, col):
    r = g[col].dropna()
    if len(r) < 30: return pd.Series(dict(n=len(r)))
    se = r.std()/np.sqrt(len(r))
    return pd.Series(dict(n=len(r), win=round((r>0).mean()*100,1), avgR=round(r.mean(),3), t=round(r.mean()/se,1),
        PF=round(r[r>0].sum()/-r[r<0].sum(),2), medRR=round(g['rr_full' if col=='R_full' else 'rr_half'].median(),2)))
pd.set_option('display.width',200); pd.set_option('display.max_rows',300)
for col in ['R_full','R_half']:
    print('\n=====', col, 'by htf'); print(df.groupby('htf').apply(st, col))
    print('\n=====', col, 'by htf,sym'); print(df.groupby(['htf','sym']).apply(st, col))
for col in ['R_full']:
    for f in ['with_trend','pdl_pdh_swept','pw_swept','body_inside']:
        print('\n=====', col, 'by', f); print(df.groupby(['htf',f]).apply(st, col))
    df['depth_q']=pd.cut(df.sweep_depth,[0,.05,.15,.3,.6,10])
    df['close_q']=pd.cut(df.close_pos,[0,.25,.5,.75,1])
    print('\n===== by sweep depth (frac of C1 range)'); print(df.groupby(['htf','depth_q']).apply(st,col))
    print('\n===== by close position into C1'); print(df.groupby(['htf','close_q']).apply(st,col))
    print('\n===== 4h by NY start hour'); print(df[df.htf=='4h'].groupby('ny_hour').apply(st,col))
    print('\n===== 1h by NY start hour'); print(df[df.htf=='1h'].groupby('ny_hour').apply(st,col))
    df['period']=np.where(df.year<=2017,'2012-17','2018-22')
    print('\n===== by period'); print(df.groupby(['htf','period']).apply(st,col))
